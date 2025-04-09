import express from 'express';
import { loginContractor, appointmentsContractor, appointmentCancel, contractorList, changeAvailablity, appointmentComplete, contractorDashboard, contractorProfile, updateContractorProfile } from '../controllers/ContractorController.js';
import authContractor from '../middleware/authContractor.js';
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

export default contractorRouter;