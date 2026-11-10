import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { UserRole } from "../generated/prisma/enums";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// Firewall cho admin
router.use(requireAuth);
router.use(requireRole(UserRole.ADMIN));

// Quản lý người dùng
router.get("/users", AdminController.getUsers);

export default router;
