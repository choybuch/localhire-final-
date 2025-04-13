import express from 'express';
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addContractor,
    allContractors,
    adminDashboard,
    pendingApprovals, // Add this import
    getUserDetails
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/ContractorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

const adminRouter = express.Router();

// Add this new route
adminRouter.get("/pending-approvals", authAdmin, pendingApprovals);

// Existing routes
adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-contractor", authAdmin, upload.single('image'), addContractor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-contractors", authAdmin, allContractors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.post('/handle-approval', authAdmin, async (req, res) => {
    try {
        const appointment = await appointmentModel.findByIdAndUpdate(
            req.body.appointmentId,
            {
                status: req.body.approved ? "completed" : "rejected",
                isCompleted: req.body.approved
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Appointment ${req.body.approved ? "approved" : "rejected"}`,
            appointment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

adminRouter.get('/users', authAdmin, async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ success: false, message: "Search query missing" });
    }

    try {
        const regex = new RegExp(search, 'i'); // case-insensitive search
        const users = await userModel.find({
            $or: [
                { name: regex },
                { email: regex },
                { phone: regex }
            ]
        });

        res.json(users);
    } catch (error) {
        console.error("User search error:", error);
        res.status(500).json({ success: false, message: "Error searching users" });
    }
});

adminRouter.get('/users/:userId/details', authAdmin, getUserDetails);

export default adminRouter;