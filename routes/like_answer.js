const db = require('../db'); // MySQL connection
const { broadcastUpdates, broadcastuserupdate, broadcastpostupdate } = require('../utils/websocket');
const router = require('./googleLogin');
require('dotenv').config();


router.post('/like/answer', async (req, res) => {
    const { uid } = req.body;
    const { pid } = req.body;
    console.log(pid);
    const ansid=pid
    console.log(uid,ansid)
    try {
        // Check if the user has already liked this answer
        const [existing] = await await db.promise().query(
            "SELECT * FROM answer_likes WHERE uid = ? AND ansid = ?",
            [uid, ansid]
        );
        const [resr]= await db.promise().query(
            "SELECT q.uid,q.pid FROM questions q JOIN answers a ON q.pid = a.pid WHERE a.ansid = ?",
            [ansid]
        );


        if (existing.length > 0) {
            // Unlike the answer if already liked
            await await db.promise().query("DELETE FROM answer_likes WHERE uid = ? AND ansid = ?", [uid, ansid]);
            await await db.promise().query("UPDATE answers SET likes = likes - 1 WHERE ansid = ?", [ansid]);
            broadcastpostupdate({ type: "NEW_PALIKE", pid:resr[0].pid,ansid,flag:-1},resr[0].pid);
            broadcastuserupdate({ type: "NEW_UALIKE",pid: resr[0].pid,ansid,flag:-1},resr[0].uid);
            broadcastUpdates({ type: "NEW_ALIKE",pid: resr[0].pid,ansid,flag:-1});
            return res.status(200).json({ message: "Answer unliked" });
            
        }

        // Like the answer
        else
        {
            await await db.promise().query("INSERT INTO answer_likes (uid, ansid) VALUES (?, ?)", [uid, ansid]);
            await await db.promise().query("UPDATE answers SET likes = likes + 1 WHERE ansid = ?", [ansid]);
            broadcastpostupdate({ type: "NEW_PALIKE", pid:resr[0].pid,ansid,flag:0},resr[0].pid);
            broadcastuserupdate({ type: "NEW_UALIKE", pid:resr[0].pid,ansid,flag:0},resr[0].uid);
            broadcastUpdates({ type: "NEW_ALIKE", pid:resr[0].pid,ansid,flag:0});
            return res.status(200).json({ message: "Answer liked" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
