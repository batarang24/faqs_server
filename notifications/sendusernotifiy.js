const admin = require('firebase-admin');
const db = require('../db'); // Your MySQL connection

async function sendusernotify(question,uid,pid) {
    console.log('i am to demonstrate' + pid)
    try {
        // 1️⃣ Get users who followed the location (within 5km)
        const query = `

            SELECT uft.fcm_token, uft.uid 
            FROM follow f
            JOIN user_fcm_tokens uft ON f.following = uft.uid
            WHERE f.followed = ? AND uft.fcm_token IS NOT NULL

        `
        const query2=`SELECT name FROM users WHERE uid=?`;
        
        
        const [rows] = await db.promise().query(query, [uid]);
        const [fetch]=await db.promise().query(query2,[uid]);
        var quote=fetch[0].name+" post a new question.";
        
        console.log("i am from followers");
        console.log(rows);
        // 2️⃣ Extract FCM tokens
        const tokens = rows.map(row => row.fcm_token);

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
        if (tokens.length === 0) return; // No users to notify

        // 3️⃣ Create FCM notification payload
        const message = {
            notification: {
                title: quote,
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

module.exports = sendusernotify;
