import { Request, Response } from "express";
import { prisma } from "../configs/prisma.client";
import { error } from "node:console";

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
      // CHẶN CACHE:
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const id = req.params.id as string;
      const user = res.locals.user;

      const job = await prisma.job.findUnique({
        where: { id: id },
        include: {
          company: { select: { fullName: true, email: true } },
        },
      });

      if (!job) {
        return res.status(404).send("Không tìm thấy công việc này!");
      }

      let hasApplied = false;
      if (user && user.role === "CANDIDATE") {
        const existingApp = await prisma.application.findUnique({
          where: {
            jobId_candidateId: { jobId: id, candidateId: user.id },
          },
        });
        if (existingApp) hasApplied = true;
      }
      res.render("candidate/job-detail", {
        title: job.title,
        user: res.locals.user,
        job: job,
        hasApplied: hasApplied,
        success: req.query.success,
        error: req.query.error,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi tải chi tiết: " + error.message);
    }
  }

  static async postApplyJob(req: Request, res: Response) {
    const jobId = req.params.id as string;
    try {
      const candidateId = req.user?.id; // get id from token

      if (!candidateId) {
        return res.redirect("/auth/login");
      }

      await prisma.application.create({
        data: {
          jobId: jobId,
          candidateId: candidateId,
          status: "PENDING",
        },
      });

      res.redirect(`/jobs/${jobId}?success=applied`);
    } catch (error: any) {
      // Nếu lỗi do đã ứng tuyển rồi (vi phạm @@unique)
      if (error.code === "P2002") {
        return res.redirect(`/jobs/${jobId}?error=already_applied`);
      }
      res.status(500).send("Lỗi ứng tuyển: " + error.message);
    }
  }
}
