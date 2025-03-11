const admin = require('firebase-admin');
const db = require('../db'); // Your MySQL connection

async function sendanswernotify(answer,uid,pid) {
    try {
        // 1️⃣ Get users who followed the location (within 5km)
        console.log(uid)
        const query = `
            SELECT fcm_token 
            FROM user_fcm_tokens 
            WHERE uid=?;

        `;

        const [rows] = await db.promise().query(query, [uid]);
        const query2=`SELECT name FROM users WHERE uid=?`;
        
        const [fetch]=await db.promise().query(query2,[uid]);
        console.log(fetch);
        var quote=fetch[0].name+" answered your question";

        const insert=await db.promise().query(`INSERT INTO notification (uid, content, quote, viewed,pid) VALUES (?,?,?,?,?)`,[uid,answer,quote,0,pid]);
        console.log('i am from answers');
        console.log(rows);
        // 2️⃣ Extract FCM tokens
        const tokens = rows.map(row => row.fcm_token);
        if (tokens.length === 0) return; // No users to notify

        // 3️⃣ Create FCM notification payload
        const message = {
            notification: {
                title: fetch[0].name+" answered your question",
                body: answer
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

module.exports = sendanswernotify;