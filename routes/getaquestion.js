const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getaquestion', async (req, res) => {
    console.log(req.body);
    const { pid ,id} = req.body;
    //console.log(id);

    if (!pid) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        // Query to fetch questions & answers within 5 km
        const [results] = await db.promise().query(
            `
            SELECT 
            q.content AS question_content, 
            q.likes AS question_likes, 
            qu.uid AS question_uid, 
            qu.name AS question_user_name, 
            qu.photo AS question_user_photo,
            a.ansid, 
            a.content AS answer_content, 
            a.likes AS answer_likes, 
            au.uid AS answer_uid, 
            au.name AS answer_user_name, 
            au.photo AS answer_user_photo
            FROM questions q
            JOIN users qu ON q.uid = qu.uid
            LEFT JOIN answers a ON q.pid = a.pid
            LEFT JOIN users au ON a.uid = au.uid
            WHERE q.pid = ?;

            `,
            [pid]
        );

        const [results2] = await db.promise().query(
            `
            UPDATE notification SET viewed=1 WHERE nid=?

            `,
            [id]
        );

        // Organize results into a structured JSON response
        const questionsMap = new Map();

        results.forEach(row => {
            console.log(row)
            if (!questionsMap.has(row.pid)) {
                questionsMap.set(row.pid, {
                    pid: pid,
                    uid: row.question_uid,
                    content: row.question_content,
                    likes: row.question_likes,
                    question_author:row.question_user_name,
                    question_author_photo:row.question_user_photo,
                    answers: []
                });
            }

            if (row.ansid) {
                questionsMap.get(row.pid).answers.push({
                    ansid: row.ansid,
                    uid: row.answer_uid,
                    pid:pid,
                    content: row.answer_content,
                    likes: row.answer_likes,
                    answer_author:row.answer_user_name,
                    answer_author_photo:row.answer_user_photo
                });
            }
               
        });
        console.log("The question");
        console.log( Array.from(questionsMap.values()));
        
        //console.log(results);
        res.status(200).json({ question:  Array.from(questionsMap.values())});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
