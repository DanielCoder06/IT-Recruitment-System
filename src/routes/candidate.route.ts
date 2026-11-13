import { Router } from "express";
import { CandidateController } from "../controllers/candidate.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../generated/prisma/enums";

const router = Router();

router.use(requireAuth);
router.use(requireRole(UserRole.CANDIDATE));

router.get("/dashboard", CandidateController.getDashboard);

export default router;
