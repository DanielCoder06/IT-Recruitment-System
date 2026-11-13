import { Request, Response } from "express";
import { prisma } from "../configs/prisma.client";

export class JobController {
  // Hàm lấy danh sách việc làm cho Ứng viên
  static async getJobList(req: Request, res: Response) {
    try {
      //Lấy dự liệu từ search
      const { keyword, location } = req.query;

      // Điều kiện search
      const whereCondition: any = { status: "PUBLISHED" };
      if (keyword) {
      }

      const jobs = await prisma.job.findMany({
        where: { status: "PUBLISHED" }, // Chỉ lấy bài đang tuyển
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { fullName: true, email: true } }, // Lấy tên công ty
        },
      });

      // Render giao diện
      res.render("candidate/job-search", {
        title: "Tìm việc làm IT",
        user: req.user,
        jobs: jobs,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi tải danh sách việc làm: " + error.message);
    }
  }
}
