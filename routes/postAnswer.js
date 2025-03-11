const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const { broadcastUpdate, broadcastuserupdate, broadcastpostupdate } = require('../utils/websocket');
const sendanswernotify = require('../notifications/sendanswernotify');

// ✅ API to Post an Answer
router.post('/post_answer', async (req, res) => {
    const { pid, uid, content } = req.body;

    // 🔹 Validate Input
    if (!pid || !uid || !content) {
        return res.status(400).json({ error: "Can't be empty" });
    }

    try {
        // 🔹 Check if Question Exists
        const [questionCheck] = await db.promise().query(
            `SELECT * FROM questions WHERE pid = ?`, 
            [pid]
        );

        if (questionCheck.length === 0) {
            return res.status(400).json({ error: 'Question not found' });
        }

        // 🔹 Insert Answer into Database
        const [result] = await db.promise().query(
            `INSERT INTO answers (pid, uid, content, likes, created_at) 
             VALUES (?, ?, ?, 0, NOW())`,
            [pid, uid, content]
        );
        const [result2] = await db.promise().query(
            `SELECT name, photo from users WHERE uid=?`,
            [uid]
        );
        const [result3] = await db.promise().query(
            `SELECT uid from questions WHERE pid=?`,
            [pid]
        );
        console.log(questionCheck[0].latitude);
        if (result3[0].uid!=uid) {
            sendanswernotify(content,result3[0].uid,pid);
        }
        broadcastpostupdate({ type: "NEW_PANSWER", answer: {
            ansid:result.insertId,pid,uid,content,
            latitude:questionCheck[0].latitude,
            longitude:questionCheck[0].longitude,
            answer_author:result2[0].name,answer_author_photo:result2[0].photo
       }},pid);


        broadcastuserupdate({ type: "NEW_UANSWER", answer: {
            ansid:result.insertId,pid,uid,content,
            latitude:questionCheck[0].latitude,
            longitude:questionCheck[0].longitude,
            answer_author:result2[0].name,answer_author_photo:result2[0].photo
       }},result3[0].uid);

       broadcastUpdate({ type: "NEW_ANSWER", answer: {
            ansid:result.insertId,pid,uid,content,
            latitude:questionCheck[0].latitude,
            longitude:questionCheck[0].longitude,
            answer_author:result2[0].name,answer_author_photo:result2[0].photo
       }}, questionCheck[0].latitude, questionCheck[0].longitude);
        
       
       // ✅ Success Response
        res.status(200).json({ 
            message: 'Answer posted successfully', 
            answerId: result.insertId 
        });

    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
