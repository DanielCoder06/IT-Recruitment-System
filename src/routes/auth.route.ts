import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get("/register", AuthController.getRegisterPage);
router.post("/register", AuthController.postRegister);
router.get("/login", AuthController.getLoginPage);
router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);

export default router;
