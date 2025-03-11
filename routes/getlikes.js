const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getlikes', async (req, res) => {
    console.log(req.body);
   

    try {
        // Query to fetch questions & answers within 5 km
        const [pid]=await db.promise().query(
            `SELECT pid FROM question_likes WHERE uid =?`,[req.body.uid]
        )
        const [ansid]=await db.promise().query(
            `SELECT ansid FROM answer_likes WHERE uid =?`,[req.body.uid]
        )
        
        const pids=[];
        const ansids=[];
        pid.map((id)=>pids.push(id.pid))
        ansid.map((id)=>ansids.push(id.ansid))
        // Organize results into a structured JSON response
       console.log(pids)
       console.log(ansids)
        res.status(200).json({pids,ansids});
        //res.json({ questions: Array.from(questionsMap.values()) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
