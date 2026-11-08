import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get("/register", AuthController.getRegisterPage);
router.post("/register", AuthController.postRegister);

export default router;
