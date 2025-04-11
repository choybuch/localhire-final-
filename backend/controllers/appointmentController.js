import appointmentModel from '../models/appointmentModel.js';
import mongoose from 'mongoose';

// ✅ API to check appointment status
const checkAppointmentStatus = async (req, res) => {
    try {
        const { userId, contractorId, appointmentId } = req.query;

        console.log("Received parameters:", { userId, contractorId, appointmentId });

        // ✅ Find the specific appointment
        const appointment = await appointmentModel.findOne({
            _id: new mongoose.Types.ObjectId(appointmentId), // Convert string to ObjectID
            userId,
            conId: contractorId
        });
        console.log("Appointment data:", appointment);

        console.log("Query criteria:", {
            _id: new mongoose.Types.ObjectId(appointmentId),
            userId,
            contractorId
        });

        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found" 
            });
        }

        // Return both status flags
        return res.json({ 
            success: true, 
            isCompleted: appointment.isCompleted,
            hasBeenRated: appointment.hasBeenRated 
        });

    } catch (error) {
        console.error("Error checking appointment status:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// When contractor submits proof
const completeAppointment = async (req, res) => {
    try {
        const { appointmentId, imageUrl } = req.body;

        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                status: 'pending',  // Ensure this field is set
                proofImage: imageUrl,
                isCompleted: false,
                cancelled: false
            },
            { new: true }
        );

        res.json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { checkAppointmentStatus, completeAppointment };