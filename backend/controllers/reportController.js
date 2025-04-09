import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendProblemReport = async (req, res) => {
    const { userEmail, subject, message, userType } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Choose the correct recipient based on userType
        const adminEmail =
            userType === "user"
                ? process.env.USER_REPORT_EMAIL
                : process.env.CONTRACTOR_REPORT_EMAIL;

        const mailOptions = {
            from: userEmail,
            to: adminEmail,
            subject: `Report a Problem: ${subject}`,
            text: `User Type: ${userType.toUpperCase()}\nUser Email: ${userEmail}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Report submitted successfully!" });
    } catch (error) {
        console.error("Error sending report:", error);
        res.status(500).json({ success: false, message: "Error sending report" });
    }
};
