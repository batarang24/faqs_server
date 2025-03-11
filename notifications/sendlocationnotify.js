const admin = require('firebase-admin');
const db = require('../db'); // Your MySQL connection

async function sendLocationNotifications(question, latitude, longitude,pid) {
    try {
        // 1️⃣ Get users who followed the location (within 5km)
        const query = `
            SELECT DISTINCT uft.fcm_token,uft.uid 
            FROM locations fl
            JOIN users u ON fl.uid = u.uid
            JOIN user_fcm_tokens uft ON u.uid = uft.uid
            WHERE (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(fl.latitude)) * 
            COS(RADIANS(fl.longitude) - RADIANS(?)) + 
            SIN(RADIANS(?)) * SIN(RADIANS(fl.latitude))
            )) <1
            AND uft.fcm_token IS NOT NULL;

        `;
        const [rows] = await db.promise().query(query, [latitude, longitude, latitude]);
        console.log(rows);
        var quote="New Question in Your Followed Location";
        rows.forEach(async (row)=>{
           try
           {
            const insert=await db.promise().query(`INSERT INTO notification (uid, content, quote,pid) VALUES (?,?,?,?)`,[row.uid,question,quote,pid]);
           }
           catch(err)
           {
                console.log(err);
           }
        });
        // 2️⃣ Extract FCM tokens
        const tokens = rows.map(row => row.fcm_token);
        if (tokens.length === 0) return; // No users to notify

        // 3️⃣ Create FCM notification payload
        const message = {
            notification: {
                title: "New Question in Your Followed Location",
                body: question
            },
            tokens: tokens ,
            // Send to multiple users
        };

        // 4️⃣ Send notification via Firebase
        
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log("Notification sent:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

module.exports = sendLocationNotifications;
