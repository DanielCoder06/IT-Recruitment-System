import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../generated/prisma/enums";

const router = Router();

// Route public
router.get("/", JobController.getJobList);
router.get("/:id", JobController.getJobDetail);

router.post(
  "/:id/apply",
  requireAuth,
  requireRole(UserRole.CANDIDATE),
  JobController.postApplyJob,
);

export default router;
