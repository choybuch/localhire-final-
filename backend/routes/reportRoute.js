import express from "express";
import { sendProblemReport } from "../controllers/reportController.js";

const router = express.Router();
router.post("/send-report", sendProblemReport);

export default router;
