const db = require('../db'); // MySQL connection
const { broadcastUpdates, broadcastuserupdate, broadcastpostupdate } = require('../utils/websocket');
const router = require('./googleLogin');
require('dotenv').config();
broadcastuserupdate
router.post('/like/question', async (req, res) => {
    const { uid } = req.body;  // Get user ID from request body
    const { pid } = req.body; // Get question ID from URL params
    console.log(uid,pid)
    try {
        // Check if the user has already liked this question
        console.log("i am in brother")
        const [existing] = await db.promise().query(
            "SELECT * FROM question_likes WHERE uid = ? AND pid = ?",
            [uid, pid]
        );
        const [resr]= await db.promise().query(
            "SELECT uid FROM questions WHERE pid = ?",
            [pid]
        );
        //console.log(existing)
       if (existing.length > 0) {
            // Unlike the question if already liked
            await db.promise().query("DELETE FROM question_likes WHERE uid = ? AND pid = ?", [uid, pid]);
            await db.promise().query("UPDATE questions SET likes = likes - 1 WHERE pid = ?", [pid]);
            console.log('i am a test'+uid) 
            broadcastpostupdate({ type: "NEW_PQLIKE",pid,flag:-1},pid)
            broadcastuserupdate({ type: "NEW_UQLIKE",pid,flag:-1},resr[0].uid)
            broadcastUpdates({ type: "NEW_QLIKE",pid,flag:-1});
            return res.status(200).json({ message: "Question unliked" });
        }

        // Like the question
        else
        {
            await db.promise().query("INSERT INTO question_likes (uid, pid) VALUES (?, ?)", [uid, pid]);
            await db.promise().query("UPDATE questions SET likes = likes + 1 WHERE pid = ?", [pid]);
            broadcastpostupdate({ type: "NEW_PQLIKE",pid,flag:0},pid)
            broadcastuserupdate({ type: "NEW_UQLIKE",pid,flag:0},resr[0].uid);
            broadcastUpdates({ type: "NEW_QLIKE",pid,flag:0});
            return res.status(200).json({ message: "Question liked" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
