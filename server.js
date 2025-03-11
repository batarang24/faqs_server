const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const  wss = new WebSocket.Server({server});
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports=wss;
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const questionsRoute = require('./routes/getQuestions');
const postAnswerRoute = require('./routes/postAnswer');
const postQuestionRoute = require('./routes/postQuestion');
const googleLogin = require('./routes/googleLogin');
const like_qn = require('./routes/like_question');
const like_ans = require('./routes/like_answer');
const getlikes = require('./routes/getlikes');
const followloc=require('./routes/followloc');
const getfollowloc=require('./routes/getfollowloc');
const getusers=require('./routes/getusers');
const myfaqs=require('./routes/myfaqs');
const updatephoto=require('./routes/updatephoto');
const updateuser=require('./routes/updateusers');
const followusers=require('./routes/followusers');
const storefcm=require('./routes/storefcm');
const notify=require('./routes/getnotifiers');
const getaquestion=require('./routes/getaquestion');
const getfollowers=require('./routes/getfollowusers');
const deleteqnorans=require('./routes/deleteqnorans');
const generateOtp=require('./routes/generateotp');
const updatepass=require('./routes/updatepass');

app.use(express.json());

app.use('/api', signupRoute);
app.use('/api', loginRoute);
app.use('/api', questionsRoute);
app.use('/api', postQuestionRoute);
app.use('/api', postAnswerRoute);
app.use('/api', googleLogin);
app.use('/api', like_qn);
app.use('/api', like_ans);
app.use('/api', getlikes);
app.use('/api', followloc);
app.use('/api',getfollowloc);
app.use('/api',getusers);
app.use('/api',myfaqs);
app.use('/api',updatephoto);
app.use('/api',updateuser);
app.use('/api',followusers);
app.use('/api',storefcm);
app.use('/api',notify);
app.use('/api',getaquestion);
app.use('/api',getfollowers);
app.use('/api',deleteqnorans);
app.use('/api',generateOtp);
app.use('/api',updatepass);
// Store connected clients

// Export WebSocket broadcast function
server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});


