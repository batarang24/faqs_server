const db = require('../db'); // MySQL connection
const router = require('./googleLogin');
require('dotenv').config();

router.post('/followloc', async (req, res) => {
    const { uid } = req.body;  // Get user ID from request body
    const { latitude } = req.body; 
    const {longitude} =req.body;
    const {keyword}=req.body;// Get question ID from URL params
    
    try {
        // Check if the user has already liked this question
        
        const [existing] = await db.promise().query(
        "SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance FROM locations WHERE uid = ? HAVING distance <1 ORDER BY distance; ",
            [latitude,longitude,latitude,uid]
        );
        console.log(existing)
       if (existing.length > 0) {
            // Unlike the question if already liked
            await db.promise().query("DELETE FROM locations WHERE uid =? AND did= ? ", [uid,existing[0].did]);
            return res.status(200).json({ message: "Location unfollowed" ,flag:0});
        }
        
        
        // Like the question
        else
        {
            const [hell]=await db.promise().query("INSERT INTO locations (uid, latitude,longitude,keyword) VALUES (?, ?, ?,?)", [uid, latitude,longitude,keyword]); 
            //broadcastUpdates({ type: "NEW_QLIKE",pid,flag:0});
            console.log(hell);
            res.status(200).json({ message: "Location followed",flag:1,locid:hell.insertId,latitude,longitude,keyword});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
