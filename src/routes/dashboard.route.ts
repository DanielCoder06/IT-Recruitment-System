import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";
import { title } from "node:process";

const router = Router();

router.get("/", requireAuth, (req: AuthRequest, res: Response) => {
  res.render("dashboard", {
    title: "Trang cá nhân",
    user: req.user,
  });
});

export default router;
