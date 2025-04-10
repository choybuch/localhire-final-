import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addContractor, allContractors, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/ContractorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-contractor", authAdmin, upload.single('image'), addContractor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-contractors", authAdmin, allContractors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;
