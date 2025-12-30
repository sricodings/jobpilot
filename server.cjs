require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Store OTP in memory (for single user/demo purposes)
let currentOTP = null;
let otpExpiry = null;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your App Password (not login password)
    }
});

// Admin Email (Where OTP will be sent)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

app.post('/api/send-otp', async (req, res) => {
    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        currentOTP = otp;
        otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: 'Your JobTracker Admin OTP',
            text: `Your OTP for JobTracker Admin Login is: ${otp}\n\nThis code expires in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${ADMIN_EMAIL}`);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;

    if (!currentOTP || !otpExpiry) {
        return res.status(400).json({ success: false, message: 'No OTP requested' });
    }

    if (Date.now() > otpExpiry) {
        currentOTP = null;
        otpExpiry = null;
        return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (otp === currentOTP) {
        currentOTP = null; // Clear OTP after success
        otpExpiry = null;
        return res.json({ success: true, message: 'Login successful' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
