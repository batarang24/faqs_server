const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getusers', async (req, res) => {
    console.log(req.body);
   

    try {
        // Query to fetch questions & answers within 5 km
        const [results]=await db.promise().query(
            `SELECT * FROM users WHERE uid =?`,[req.body.uid]
        )
        
        const [results2]=await db.promise().query(
            `SELECT following FROM follow WHERE followed =?`,[req.body.uid]
        )
        console.log(results2);
         res.status(200).json({results,following:results2});
        //res.json({ questions: Array.from(questionsMap.values()) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
