import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, (req: Request, res: Response) => {
  res.render("dashboard", {
    title: "Trang cá nhân",
    user: req.user,
  });
});

export default router;
