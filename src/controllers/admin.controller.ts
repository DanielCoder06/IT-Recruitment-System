import { Request, Response } from "express";
import { prisma } from "../configs/prisma.client";

export class AdminController {
  static async getUsers(req: Request, res: Response) {
    try {
      //Lấy all user
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      // Render giao diện quản lý người dùng
      res.render("admin/users", {
        title: "Quản lý người dùng",
        users,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi sever:" + error.message);
    }
  }
}
