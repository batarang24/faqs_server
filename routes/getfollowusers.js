const express = require('express');
const router = express.Router();
const db = require('../db');

// API to Get Questions + Answers within 5 km
router.post('/getfollowers', async (req, res) => {
    const {list}=req.body;
    const uids=list;
    
    if (uids.length==0) {
        res.status(200).json({"results":[]});
    }
    else
    {
        const placeholders = uids.map(() => '?').join(', ');
        const query = `SELECT uid, name, photo FROM users WHERE uid IN (${placeholders})`;

        try {
            const [rows] = await db.promise().query(query, uids);
            console.log(rows);
            res.status(200).json({"results":rows});
            //return rows; // Returns an array of objects [{ uid, name, photo }, ...]
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: 'Server error' });
        }
    }
});

module.exports = router;
