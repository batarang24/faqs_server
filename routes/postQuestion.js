const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const { broadcastUpdate, broadcastuserupdate } = require('../utils/websocket');
const sendLocationNotifications = require('../notifications/sendlocationnotify');
const sendusernotify = require('../notifications/sendusernotifiy');


// ✅ API to Post a Question
router.post('/post_question', async (req, res) => {
    const { uid, content, latitude, longitude } = req.body;

    // 🔹 Validate Input
    if (!uid || !content || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // 🔹 Insert Question into Database
        const [result] = await db.promise().query(
            `INSERT INTO questions (uid, content, latitude, longitude, likes, created_at) 
             VALUES (?, ?, ?, ?, 0, NOW())`,
            [uid, content, latitude, longitude]
        );
        const [result2] = await db.promise().query(
            `SELECT name, photo from users WHERE uid=?`,
            [uid]
        );
        
        console.log(result.insertId);
        var pid=result.insertId;
        broadcastuserupdate({ type: "NEW_UQUESTION", question: {result:result.insertId,uid,content,latitude,longitude,question_author:result2[0].name,question_author_photo:result2[0].photo}}, uid);
        broadcastUpdate({ type: "NEW_QUESTION", question: {result:result.insertId,uid,content,latitude,longitude,question_author:result2[0].name,question_author_photo:result2[0].photo}}, latitude, longitude,);
        // ✅ Success Response
        sendLocationNotifications(content, latitude, longitude,pid);
        sendusernotify(content,uid,pid);
        res.status(200).json({ 
            message: 'Question posted successfully', 
            questionId: result.insertId 
        });

        
       


    } catch (error) {
        console.error('Error posting question:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
