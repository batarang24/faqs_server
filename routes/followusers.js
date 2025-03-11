const db = require('../db'); // MySQL connection
const { broadcastuserupdate } = require('../utils/websocket');
const router = require('./googleLogin');
require('dotenv').config();

router.post('/followusers', async (req, res) => {
    console.log('followusers')
    console.log(req.body);
    const { followed ,following} = req.body; 
     // Get user ID from request body
    // Get question ID from URL params
    
    try {
        // Check if the user has already liked this question
        
        const [existing] = await db.promise().query(
            "SELECT * FROM follow WHERE followed = ? AND following =?",
            [followed,following]
        );
        console.log(existing)
       if (existing.length > 0) {
            // Unlike the question if already liked
            await db.promise().query("DELETE FROM follow WHERE followed = ? AND following =? ", [followed,following]);
            //broadcastuserupdate({type:'REMOVE_1'},followed);
            return res.status(200).json({ message: "User unfollowed" ,flag:0});
            
        }
        
        
        // Like the question
        else
        {
            const [hell]=await db.promise().query("INSERT INTO follow (followed,following) VALUES (?, ?)", [followed,following]); 
            //broadcastUpdates({ type: "NEW_QLIKE",pid,flag:0});
            console.log(hell);
            //broadcastuserupdate({type:'ADD_1'},followed)
            res.status(200).json({ message: "User followed",flag:1});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
