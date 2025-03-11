const db = require('../db'); // MySQL connection
const { broadcastUpdate, broadcastpostupdate, broadcastuserupdate } = require('../utils/websocket');
const router = require('./googleLogin');
require('dotenv').config();

router.post('/deleteqnorans', async (req, res) => {
    const { id ,flag} = req.body;  // Get user ID from request body
    
    
    try {
        var query;
        // Check if the user has already liked this question
        if (flag==0) {
            const [existing] = await db.promise().query(
                `SELECT * FROM questions WHERE pid=?`,
            [id]);
            console.log(existing)
            if (existing.length>0) {
                query="DELETE FROM questions WHERE pid=?";
                const [ex] = await db.promise().query(query,[id]);
                broadcastpostupdate({ type: "DELETE_PQUESTION", pid:id},id);
                broadcastuserupdate({ type: "DELETE_UQUESTION", pid:id},existing[0].uid);
                broadcastUpdate({ type: "DELETE_QUESTION", pid:id},existing[0].latitude,existing[0].longitude);
                res.status(200).json({ message: "Question Deleted"});
            }
            //res.json({ message: "No qn found"});
        }
        else
        {
            const [existing] = await db.promise().query(
                `SELECT q.uid ,q.pid, q.latitude,q.longitude FROM answers a JOIN questions q ON a.pid = q.pid WHERE a.ansid = ?`,[id]);
            console.log(existing)
            if (existing.length>0) {
                query="DELETE FROM answers WHERE ansid=?";
                const [ex] = await db.promise().query(query,[id]);
                broadcastpostupdate({ type: "DELETE_PANSWER", ansid:id,pid:existing[0].pid},existing[0].pid);
                broadcastuserupdate({ type: "DELETE_UANSWER", ansid:id,pid:existing[0].pid},existing[0].uid);
        
               broadcastUpdate({ type: "DELETE_ANSWER",ansid:id,pid:existing[0].pid}, existing[0].latitude, existing[0].longitude);
                
                res.status(200).json({ message: "Answer Deleted"});
            }
            
            
        }
        
    

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
