import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import contractorModel from "../models/contractorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Contractor
const addContractor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add contractor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const contractorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newContractor = new contractorModel(contractorData)
        await newContractor.save()
        res.json({ success: true, message: 'Contractor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all contractors list for admin panel
const allContractors = async (req, res) => {
    try {

        const contractors = await contractorModel.find({}).select('-password')
        res.json({ success: true, contractors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const pendingApprovals = await appointmentModel.find({
            status: "pending",
            proofImage: { $exists: true, $ne: "" }
        });

        console.log("Fetched pending approvals:", pendingApprovals.length);

        const contractors = await contractorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            contractors: contractors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse(),
            pendingApprovals: pendingApprovals
        }

        res.json({ success: true, dashData });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const pendingApprovals = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ status: 'pending' });

        res.status(200).json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.error("Pending Approvals Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pending approvals",
        });
    }
};

// new
const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId);

        const allAppointments = await appointmentModel
            .find({ userId })
            .sort({ date: -1 }); // latest first

        const current = allAppointments.find(a => a.status === 'confirmed' && !a.cancelled);
        const last = allAppointments.find(a => a.status === 'completed');

        res.json({
            success: true,
            user,
            totalAppointments: allAppointments.length,
            currentContractor: current?.conData || null,
            lastContractor: last?.conData || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
};

const approveContractor = async (req, res) => {
    try {
        const { contractorId, approved } = req.body;

        if (!contractorId) {
            return res.status(400).json({
                success: false,
                message: "Contractor ID is required"
            });
        }

        if (approved) {
            // Approve the contractor
            await contractorModel.findByIdAndUpdate(contractorId, {
                isApproved: true,
                approvalDate: new Date()
            });
            res.json({
                success: true,
                message: "Contractor approved successfully"
            });
        } else {
            // Reject and delete the contractor
            await contractorModel.findByIdAndDelete(contractorId);
            res.json({
                success: true,
                message: "Contractor rejected and removed"
            });
        }

    } catch (error) {
        console.error("Contractor approval error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addContractor,
    allContractors,
    adminDashboard,
    pendingApprovals,
    getUserDetails,
    approveContractor // Ensure pendingApprovals is exported
}