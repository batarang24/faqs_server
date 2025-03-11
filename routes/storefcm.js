const db = require('../db'); // MySQL connection
//const { broadcastuserupdate } = require('../utils/websocket');
const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/storefcm', async (req, res) => {
    console.log(req.body);
    const { userId ,fcmToken} = req.body; 
     // Get user ID from request body
    // Get question ID from URL params
    
  if (!userId || !fcmToken) {
        return res.status(400).json({ error: "Missing user ID or FCM token" });
    }

    try {
        db.promise().query( `
            INSERT INTO user_fcm_tokens (uid, fcm_token) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE fcm_token = VALUES(fcm_token)
        `,[userId,fcmToken]);

        res.status(200).json({ success: true, message: "FCM token stored successfully" });
    } catch (error) {
        console.error("Error storing FCM token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
