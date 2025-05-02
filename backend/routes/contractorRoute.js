import express from 'express';
import { loginContractor, appointmentsContractor, appointmentCancel, contractorList, changeAvailablity, appointmentComplete, contractorDashboard, contractorProfile, updateContractorProfile, addContractorFrontend } from '../controllers/ContractorController.js';
import authContractor from '../middleware/authContractor.js';
import upload from '../middleware/multer.js'; // Import multer
import appointmentModel from '../models/appointmentModel.js'; // Import appointment model
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

const contractorRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/contractors');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadContractor = multer({ storage: storage });

contractorRouter.post("/login", loginContractor)
contractorRouter.post("/cancel-appointment", authContractor, appointmentCancel)
contractorRouter.get("/appointments", authContractor, appointmentsContractor)
contractorRouter.get("/list", contractorList)
contractorRouter.post("/change-availability", authContractor, changeAvailablity)
contractorRouter.post("/complete-appointment", authContractor, appointmentComplete)
contractorRouter.get("/dashboard", authContractor, contractorDashboard)
contractorRouter.get("/profile", authContractor, contractorProfile)
contractorRouter.post("/update-profile", authContractor, updateContractorProfile)

// New route for submitting proof of completion
contractorRouter.post('/submit-proof',
    upload.single('proofImage'), // Using same multer config as profile
    authContractor,
    async (req, res) => {
        console.log("➡️ SUBMIT PROOF ROUTE HIT");
        console.log("Appointment ID:", req.body.appointmentId);
        console.log("Uploaded file path:", req.file?.path);

        try {
            if (!req.file?.path) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const cloudResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'proofImages'
            });

            console.log("Cloudinary secure_url:", cloudResult.secure_url);

            const appointment = await appointmentModel.findByIdAndUpdate(
                req.body.appointmentId,
                {
                    proofImage: cloudResult.secure_url, // This is what the dashboard expects
                    status: "pending"
                },
                { new: true }
            );

            console.log("Updated appointment:", appointment);

            res.status(200).json({
                success: true,
                message: "Proof submitted for admin approval",
                appointment
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

contractorRouter.post("/add-contractor", uploadContractor.single('image'), addContractorFrontend);

export default contractorRouter;