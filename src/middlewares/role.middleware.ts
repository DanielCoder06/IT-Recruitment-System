import { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma/enums";

export const requireRole = (allowedRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (user.role !== allowedRole) {
      return res
        .status(403)
        .send("Lỗi 403: Bạn không có quyền truy cập trang này!");
    }

    next();
  };
};
