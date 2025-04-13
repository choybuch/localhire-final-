import express from 'express';
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addContractor,
    allContractors,
    adminDashboard,
    pendingApprovals // Add this import
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/ContractorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
import appointmentModel from '../models/appointmentModel.js';

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

export default adminRouter;