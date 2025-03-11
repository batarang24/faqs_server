const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const { broadcastUpdate, broadcastuserupdate } = require('../utils/websocket');


// ✅ API to Post an Answer
router.post('/updateuser', async (req, res) => {
    const {uid,name} = req.body;

    try {

        // 🔹 Insert Answer into Database
        const [result] = await db.promise().query(
            `UPDATE users SET name = ? WHERE uid = ?`,
            [name,uid]
        );
        
        // ✅ Success Response
        res.status(200).json({ 
            message: 'Updated', 
            name:name 
        });

    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
