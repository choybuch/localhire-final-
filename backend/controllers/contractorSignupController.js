import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const sendContractorSignup = async (req, res) => {
  const {
    name, age, contact, address,
    email, speciality, degree,
    experience, rate
  } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const attachments = [];

    if (req.files?.proofFile?.[0]) {
      attachments.push({
        filename: req.files.proofFile[0].originalname,
        path: req.files.proofFile[0].path
      });
    }

    if (req.files?.govIdFile?.[0]) {
      attachments.push({
        filename: req.files.govIdFile[0].originalname,
        path: req.files.govIdFile[0].path
      });
    }

    const mailOptions = {
      from: email,
      to: process.env.CONTRACTOR_REPORT_EMAIL,
      subject: `New Contractor Signup: ${name}`,
      text: `
New contractor application received:

Name: ${name}
Age: ${age}
Contact No.: ${contact}
Address: ${address}
Email: ${email}
Speciality: ${speciality}
Degree: ${degree}
Experience: ${experience}
Preferred Rate: ${rate}
      `,
      attachments
    };

    await transporter.sendMail(mailOptions);

    // Clean up uploaded files after sending
    attachments.forEach(file => fs.unlink(file.path, () => {}));

    res.json({ success: true, message: "Signup sent successfully!" });

  } catch (error) {
    console.error("Error sending contractor signup:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
