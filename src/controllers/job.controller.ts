import { Request, Response } from "express";
import { prisma } from "../configs/prisma.client";

export class JobController {
  static async getJobList(req: Request, res: Response) {
    try {
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

  static async getJobDetail(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const job = await prisma.job.findUnique({
        where: { id: id },
        include: {
          company: { select: { fullName: true, email: true } },
        },
      });

      if (!job) {
        return res.status(404).send("Không tìm thấy công việc này!");
      }

      res.render("candidate/job-detail", {
        title: job.title,
        user: res.locals.user,
        job: job,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi tải chi tiết: " + error.message);
    }
  }
}
