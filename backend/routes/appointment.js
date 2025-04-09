import express from 'express';
const router = express.Router();
import appointmentModel from '../models/appointmentModel.js';
import { checkAppointmentStatus } from '../controllers/appointmentController.js';

router.post("/mark-rated", async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.hasBeenRated) {
            return res.status(400).json({ success: false, message: "Appointment already rated" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            hasBeenRated: true,
        });

        res.json({ success: true, message: "Appointment marked as rated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// In your appointment routes (appointment.js)
router.post('/complete', async (req, res) => {
    try {
        const { appointmentId, imageUrl } = req.body;

        const updated = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                status: 'pendingApproval',
                proofImage: imageUrl,
                isCompleted: false
            },
            { new: true }
        );

        res.json({ success: true, appointment: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/approve-completion', async (req, res) => {
    try {
        const { appointmentId, approve } = req.body;

        const update = approve ?
            { status: 'completed', isCompleted: true } :
            { status: 'needsRevision', isCompleted: false };

        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            update,
            { new: true }
        );

        res.json({ success: true, appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ This line MUST be outside all catch blocks
router.get("/status", checkAppointmentStatus);

export default router;
