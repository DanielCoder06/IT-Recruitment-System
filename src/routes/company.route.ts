import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../generated/prisma/enums";

const router = Router();

router.use(requireAuth);
router.use(requireRole(UserRole.COMPANY));

router.get("/dashboard", CompanyController.getDashboard);

export default router;
