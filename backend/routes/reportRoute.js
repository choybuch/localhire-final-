import express from "express";
import { sendProblemReport } from "../controllers/reportController.js";
import { sendContractorSignup } from "../controllers/contractorSignupController.js";
import upload from "../middleware/multerSignup.js";

const router = express.Router();

router.post("/send-report", sendProblemReport);

// This handles 2 named file fields: proofFile and govIdFile
router.post(
  "/contractor-signup",
  upload.fields([
    { name: 'proofFile', maxCount: 1 },
    { name: 'govIdFile', maxCount: 1 }
  ]),
  sendContractorSignup
);

export default router;
