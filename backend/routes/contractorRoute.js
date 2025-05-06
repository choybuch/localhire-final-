import express from 'express';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { loginContractor, appointmentsContractor, appointmentCancel, contractorList, 
         changeAvailablity, appointmentComplete, contractorDashboard, contractorProfile, 
         updateContractorProfile, addContractorFrontend } from '../controllers/ContractorController.js';
import authContractor from '../middleware/authContractor.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const contractorRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'contractors',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Configure multer for multiple file uploads
const uploadContractor = multer({ storage });

// Handle multiple file uploads with specific field names
contractorRouter.post('/add-contractor', uploadContractor.fields([
  { name: 'image', maxCount: 1 },
  { name: 'govId', maxCount: 1 },
  { name: 'proofDoc', maxCount: 1 }
]), addContractorFrontend);

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
    uploadContractor.single('proofImage'), // Changed from upload to uploadContractor
    authContractor,
    async (req, res) => {
        console.log("➡️ SUBMIT PROOF ROUTE HIT");
        console.log("Appointment ID:", req.body.appointmentId);
        console.log("Uploaded file path:", req.file?.path);

        try {
            if (!req.file?.path) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            // Using the same Cloudinary configuration
            const cloudResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'proofImages'
            });

            console.log("Cloudinary secure_url:", cloudResult.secure_url);

            const appointment = await appointmentModel.findByIdAndUpdate(
                req.body.appointmentId,
                {
                    proofImage: cloudResult.secure_url,
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

export default contractorRouter;