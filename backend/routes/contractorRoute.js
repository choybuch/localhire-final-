import express from 'express';
import { loginContractor, appointmentsContractor, appointmentCancel, contractorList, changeAvailablity, appointmentComplete, contractorDashboard, contractorProfile, updateContractorProfile } from '../controllers/ContractorController.js';
import authContractor from '../middleware/authContractor.js';
import upload from '../middleware/multer.js'; // Import multer
import appointmentModel from '../models/appointmentModel.js'; // Import appointment model

const contractorRouter = express.Router();

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
        try {
            const appointment = await appointmentModel.findByIdAndUpdate(
                req.body.appointmentId,
                {
                    proofImage: req.file?.path || "",
                    status: "pending" // Changed to "pending" to match the intended status
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Proof submitted for admin approval",
                appointment
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

export default contractorRouter;