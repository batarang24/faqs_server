const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getfollowloc', async (req, res) => {
    console.log('hello')
    console.log(req.body);
   

    try {
        // Query to fetch questions & answers within 5 km
        const [results]=await db.promise().query(
            `SELECT * FROM locations WHERE uid =?`,[req.body.uid]
        )
        console.log("Follow results")
        console.log(results);
        if (results.length>0) {
            res.status(200).json({ result:results,flag:1});
        }
        else
        {
            res.status(200).json({result:"No location followed",flag:0})
        }
        
        //res.json({ questions: Array.from(questionsMap.values()) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
