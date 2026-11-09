import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../configs/prisma.client";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    // 1 Không có token -> Đưa về trang login
    if (!token) {
      return res.redirect("/auth/login");
    }

    // 2 Có token -> Giải mã token có hợp lệ không
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    ) as { userId: string };

    // 3 Tìm usertrong db
    const user = await prisma.user.findUnique({
      where: { id: decode.userId },
    });
    if (!user) {
      return res.redirect("/auth/login");
    }

    // 4 Hợp lệ -> gắn user vào request cho phép đi tiếp
    req.user = user;
    next();
  } catch (error) {
    // 5 Token hết hạng hoặc không hợp lệ
    return res.redirect("/auth/login");
  }
};
