const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const { broadcastUpdate, broadcastuserupdate } = require('../utils/websocket');


// ✅ API to Post an Answer
router.post('/updatephoto', async (req, res) => {
    const {uid,url} = req.body;

    try {

        // 🔹 Insert Answer into Database
        const [result] = await db.promise().query(
            `UPDATE users SET photo = ? WHERE uid = ?`,
            [url,uid]
        );
        
        // ✅ Success Response
        res.status(200).json({ 
            message: 'Updated', 
            url:url 
        });

    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
