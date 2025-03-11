const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getnotifiers', async (req, res) => {
    const {uid}=req.body;
   

    try {
        // Query to fetch questions & answers within 5 km
        const [results]=await db.promise().query(
            `SELECT * FROM notification WHERE uid=?`,[uid]
        )
        console.log("Notification results")
        console.log(results);
        if (results.length>0) {
            res.status(200).json({ result:results});
        }
        else
        {
            res.status(200).json({result:[]})
        }
        
        //res.json({ questions: Array.from(questionsMap.values()) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
