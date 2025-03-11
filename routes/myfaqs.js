const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/myfaqs', async (req, res) => {
    console.log(req.body);
   

    try {
        // Query to fetch questions & answers within 5 km
        const [results]=await db.promise().query(
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
                LEFT JOIN users qu ON q.uid = qu.uid  -- Get the question author's name & photo
                LEFT JOIN answers a ON q.pid = a.pid  -- Get the answers for the question
                LEFT JOIN users au ON a.uid = au.uid  -- Get the answer author's name & photo
                WHERE q.uid = ?  -- Filter by the specific user (question owner)
                ORDER BY q.created_at DESC, a.likes DESC;
            `,[req.body.uid]
        )
        const [results2]=await db.promise().query(
            `SELECT name,email,photo FROM users WHERE uid=?`,[req.body.uid]
        )
        const [results3]=await db.promise().query(
            `SELECT followed FROM follow WHERE following=?`,[req.body.uid]
        )
        const [results4]=await db.promise().query(
            `SELECT following FROM follow WHERE followed=?`,[req.body.uid]
        )
        console.log('i am from results3 ',results3)
        const questionsMap = new Map();
        const follower=[]
        const following=[]
        results3.forEach(row=>{
            follower.push(row.followed);
        })
        results4.forEach(row=>{
            following.push(row.following)
        })
        results.forEach(row => {
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
                    answer_author_photo:row.answer_author_photo,
                });
            }
        });
        console.log("Follow results")
        console.log(results3);
        res.status(200).json({ questions: Array.from(questionsMap.values()), name:results2[0].name, email:results2[0].email,photo:results2[0].photo,followers:follower,following:following});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
