import express from "express";
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendProblemReport } from "../controllers/reportController.js";
import upload from "../middleware/multerSignup.js";

const router = express.Router();

router.post("/send-report", sendProblemReport);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/contractor-signup', upload.fields([{ name: 'proofFile', maxCount: 1 }, { name: 'govIdFile', maxCount: 1 }]), async (req, res) => {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    try {
        const { name, age, contact, address, email, speciality, degree, experience, rate } = req.body;
        const proofFile = req.files['proofFile'][0].path;
        const govIdFile = req.files['govIdFile'][0].path;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Contractor Signup',
            html: `
                <p>Name: ${name}</p>
                <p>Age: ${age}</p>
                <p>Contact: ${contact}</p>
                <p>Address: ${address}</p>
                <p>Email: ${email}</p>
                <p>Speciality: ${speciality}</p>
                <p>Degree: ${degree}</p>
                <p>Experience: ${experience}</p>
                <p>Rate: ${rate}</p>
                <p>Proof File: <a href="cid:proofFile">View Attachment</a></p>
                <p>Gov ID File: <a href="cid:govIdFile">View Attachment</a></p>
            `,
            attachments: [
                {
                    filename: 'proofFile',
                    path: proofFile,
                    cid: 'proofFile'
                },
                {
                    filename: 'govIdFile',
                    path: govIdFile,
                    cid: 'govIdFile'
                }
            ]
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ success: false, message: 'Error sending email' });
        }

    } catch (error) {
        console.error("Contractor signup error:", error);
        res.status(500).json({ success: false, message: 'Contractor signup failed' });
    }
});

export default router;
