import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import contractorModel from "../models/contractorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import validator from "validator";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

// API for contractor Login 
const loginContractor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await contractorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get contractor appointments for contractor panel
const appointmentsContractor = async (req, res) => {
    try {

        const { conId } = req.conId;
        const appointments = await appointmentModel.find({ conId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for contractor panel
const appointmentCancel = async (req, res) => {
    try {
        const { conId, appointmentId } = req.body;

        // Fetch the appointment
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Check if appointment exists
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Ensure contractor is allowed to cancel this appointment
        if (appointmentData.conId !== conId) {
            return res.status(403).json({ success: false, message: "Unauthorized cancellation" });
        }

        // Update appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        return res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.error("Error cancelling appointment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// API to mark appointment completed for contractor panel

const appointmentComplete = async (req, res) => {
    console.log('✅ appointmentComplete controller hit with:', req.body);
    try {
        const { conId, appointmentId, imageUrl } = req.body;

        // Find the appointment
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Check if appointment exists
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Ensure contractor is allowed to complete this appointment
        if (appointmentData.conId !== conId) {
            return res.status(403).json({ success: false, message: "Unauthorized completion" });
        }

        // Update the appointment
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                status: 'pending', // Change from 'pending' to 'pendingApproval'
                proofImage: imageUrl,
                isCompleted: false,
                cancelled: false
            },
            { new: true, runValidators: true }
        );

        // Respond with the updated appointment
        res.json({ success: true, appointment: updatedAppointment });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all contractors list for Frontend
const contractorList = async (req, res) => {
    try {
        // Modified query to handle both old and new contractors
        const contractors = await contractorModel.find({
            $or: [
                { isApproved: true }, // New contractors that are approved
                { isApproved: { $exists: false } } // Old contractors without approval field
            ]
        }).select('-password -email');
        
        res.json({ success: true, contractors });
    } catch (error) {
        console.error("Error fetching contractors:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to change contractor availablity for Admin and Contractor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { conId } = req.body

        const conData = await contractorModel.findById(conId)
        await contractorModel.findByIdAndUpdate(conId, { available: !conData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get contractor profile for  Contractor Panel
const contractorProfile = async (req, res) => {
    try {

        const { conId } = req.body
        const profileData = await contractorModel.findById(conId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update contractor profile data from  Contractor Panel
const updateContractorProfile = async (req, res) => {
    try {

        const { conId, fees, address, available } = req.body

        await contractorModel.findByIdAndUpdate(conId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for contractor panel
const contractorDashboard = async (req, res) => {
    try {

        const { conId } = req.body

        const appointments = await appointmentModel.find({ conId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted && !item.cancelled) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const addContractorFrontend = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !fees || !req.files) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Check if files were uploaded
        if (!req.files.image || !req.files.govId || !req.files.proofDoc) {
            return res.status(400).json({ 
                success: false, 
                message: 'All documents are required' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create contractor data object
        const contractorData = {
            name,
            email,
            password: hashedPassword,
            image: req.files.image[0].path,
            govId: req.files.govId[0].path,
            proofDoc: req.files.proofDoc[0].path,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: JSON.parse(address),
            isApproved: false,
            date: Date.now()
        };

        // Save to database
        const newContractor = new contractorModel(contractorData);
        await newContractor.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Registration submitted for approval' 
        });

    } catch (error) {
        console.error('Contractor registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
};

export const approveContractor = async (req, res) => {
    try {
        const { contractorId } = req.body;
        await contractorModel.findByIdAndUpdate(contractorId, {
            isApproved: true,
            approvalDate: Date.now()
        });
        res.json({ success: true, message: 'Contractor approved successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export {
    loginContractor,
    appointmentsContractor,
    appointmentCancel,
    contractorList,
    changeAvailablity,
    appointmentComplete,
    contractorDashboard,
    contractorProfile,
    updateContractorProfile
}