const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/questions', async (req, res) => {
    //console.log(req.body);
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        // Query to fetch questions & answers within 5 km
        const [results] = await db.promise().query(
            `SELECT 
            q.*, 
            qu.name AS question_author, 
            qu.photo AS question_author_photo,
            a.ansid, 
            a.content AS answer, 
            a.uid AS answer_uid, 
            a.likes AS answer_likes, 
            au.name AS answer_author, 
            au.photo AS answer_author_photo
            FROM questions q
            LEFT JOIN users qu ON q.uid = qu.uid  -- Join users to get question author details
            LEFT JOIN answers a ON q.pid = a.pid  -- Join answers to get answer details
            LEFT JOIN users au ON a.uid = au.uid  -- Join users to get answer author details
            WHERE (6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(q.latitude)) * 
                COS(RADIANS(q.longitude) - RADIANS(?)) + 
                SIN(RADIANS(?)) * SIN(RADIANS(q.latitude))
            )) <1
            ORDER BY q.created_at DESC, a.likes DESC;`,
            [latitude, longitude, latitude]
        );

        // Organize results into a structured JSON response
        const questionsMap = new Map();

        results.forEach(row => {
          //  console.log(row)
            if (!questionsMap.has(row.pid)) {
                questionsMap.set(row.pid, {
                    pid: row.pid,
                    uid: row.uid,
                    content: row.content,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    likes: row.likes,
                    created_at: row.created_at,
                    question_author:row.question_author,
                    question_author_photo:row.question_author_photo,
                    answers: []
                });
            }

            if (row.ansid) {
                questionsMap.get(row.pid).answers.push({
                    ansid: row.ansid,
                    uid: row.answer_uid,
                    pid:row.pid,
                    content: row.answer,
                    likes: row.answer_likes,
                    answer_author:row.answer_author,
                    answer_author_photo:row.answer_author_photo
                });
            }
        });

        res.status(200).json({ questions: Array.from(questionsMap.values()) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
