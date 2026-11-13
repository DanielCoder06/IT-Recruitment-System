import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const router = Router();

// Route public
router.get("/", JobController.getJobList);

export default router;
