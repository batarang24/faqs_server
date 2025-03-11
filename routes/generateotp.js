const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const db = require('../db');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

router.post("/generateotp", async (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const [user] = await db.promise().query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (user.length === 0) {
        return res.status(400).json({ error: 'Email not found' });
    }
    const otp = generateOtp(); // Generate OTP

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset OTP",
            html: `<p>Your OTP for resetting the password is: <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "OTP sent successfully", otp }); // Send OTP to frontend for verification
        } catch (error) {
            res.status(400).json({ error: "Error sending OTP" });
        }
    } catch (error) {
        res.status(400).json({ error: 'Server error' });
    }

  
});

module.exports = router;
