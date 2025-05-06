import express from 'express';
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addContractor,
    allContractors,
    adminDashboard,
    pendingApprovals, // Add this import
    getUserDetails,
    approveContractor
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/ContractorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import contractorModel from '../models/contractorModel.js';

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

adminRouter.get("/pending-contractors", authAdmin, async (req, res) => {
    try {
        console.log("Fetching pending contractors");
        const contractors = await contractorModel.find({ 
            isApproved: false 
        });
        
        console.log("Found pending contractors:", contractors);
        
        res.json({ 
            success: true, 
            contractors,
            count: contractors.length 
        });
    } catch (error) {
        console.error("Error in pending-contractors route:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Add the approve contractor route
adminRouter.post('/approve-contractor', authAdmin, approveContractor);

adminRouter.post('/update-contractor-availability', authAdmin, async (req, res) => {
    try {
        const { contractorId, available } = req.body;
        
        if (!contractorId) {
            return res.status(400).json({
                success: false,
                message: 'Contractor ID is required'
            });
        }
    
        const contractor = await contractorModel.findByIdAndUpdate(
            contractorId,
            { available },
            { new: true }
        );
    
        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor not found'
            });
        }
    
        res.json({
            success: true,
            message: 'Availability updated successfully',
            contractor
        });
    
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default adminRouter;