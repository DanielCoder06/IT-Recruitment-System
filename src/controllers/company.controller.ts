import { Request, Response } from "express";
import { prisma } from "../configs/prisma.client";
import sanitizeHtml from "sanitize-html";

export class CompanyController {
  // Render giao diện dashboard
  static getDashboard(req: Request, res: Response) {
    res.render("company/dashboard", {
      title: "Dashboard Công ty",
      user: req.user,
    });
  }

  // Hiển thị danh sách bài đăng tuyển dụng
  static async getJobs(req: Request, res: Response) {
    try {
      // 1 Lấy id của công ty
      const companyId = req.user?.id;

      // 2 lấy danh sách bài đăng của công ty tương ứng với id
      const jobs = await prisma.job.findMany({
        where: {
          companyId: companyId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // 3 Render giao diện và hiển thị job
      res.render("company/jobs", {
        title: "Quản lý bài đăng",
        user: req.user,
        jobs: jobs,
        success: req.query.success,
      });
    } catch (error: any) {
      console.error("Lỗi lấy danh sách job:", error);
      res.status(500).send("Lỗi tải danh sách bài đăng: " + error.message);
    }
  }

  // Giao diện tạo bài đăng
  static getCreateJobPage(req: Request, res: Response) {
    res.render("company/create-job", {
      title: "Đăng bài mới",
      user: req.user,
    });
  }

  // Xử lý đăng bài
  static async postCreateJob(req: Request, res: Response) {
    try {
      const { title, location, salary, skills, description } = req.body;

      // 1 Lấy ID công ty
      const companyId = req.user?.id;
      if (!companyId) {
        return res.redirect("/auth/login");
      }
      // 2 Xử lý mảng skill
      const skillArray = skills
        ? skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      // 3 Làm sạch HTML của mô tả (chống XSS)
      const cleanDescription = sanitizeHtml(description, {
        allowedTags: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "h2",
          "h3",
          "ul",
          "ol",
          "li",
          "a",
        ],
        allowedAttributes: { a: ["href", "target"] },
      });

      // 4 Lưu bài tuyển dụng vào db
      await prisma.job.create({
        data: {
          title,
          location,
          salary,
          skills: skillArray,
          description: cleanDescription,
          companyId: companyId,
        },
      });

      // 5 Done -> render danh sách bài đăng
      res.redirect("/company/jobs");
    } catch (error: any) {
      console.error("Lỗi tạo job:", error);
      res.status(500).send("Có lỗi xảy ra khi đăng bài: " + error.message);
    }
  }

  // Hiện thị chi tiết bài đăng
  static async getJobDetail(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const companyId = req.user?.id;

      // Tìm bài đăng của công ty theo id
      const job = await prisma.job.findFirst({
        where: {
          id: id,
          companyId: companyId,
        },
      });

      if (!job) {
        return res
          .status(404)
          .send("Không tìm thấy bài đăng hoặc bạn không có quyền xem!");
      }

      res.render("company/job-detail", {
        title: job.title,
        user: req.user,
        job: job,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi tải chi tiết bài đăng: " + error.message);
    }
  }

  // Hiển thị form sửa bài đăng
  static async getEditJobPage(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const companyId = req.user?.id;

      // Lấy bài đăng của công ty
      const job = await prisma.job.findFirst({
        where: {
          id: id,
          companyId: companyId,
        },
      });

      if (!job) {
        return res
          .status(404)
          .send("Không tìm thấy bài đăng hoặc bạn không có quyền xem!");
      }

      res.render("company/edit-job", {
        title: "Chỉnh sửa bài đăng",
        user: req.user,
        job: job,
      });
    } catch (error: any) {
      res.status(500).send("Lỗi tải trang sửa: " + error.message);
    }
  }

  // Xử liệu dữ liệu khi ấn nút cập nhật bài đăng
  static async postUpdateJob(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const companyId = req.user?.id;
      const { title, location, salary, skills, description } = req.body;
      // Kiểm tra quyền truy cập
      const existingJob = await prisma.job.findFirst({
        where: {
          id: id,
          companyId: companyId,
        },
      });

      if (!existingJob)
        return res.status(403).send("Không có quyền sửa bài này!");

      const skillArray = skills
        ? skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      const cleanDescription = sanitizeHtml(description, {
        allowedTags: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "h2",
          "h3",
          "ul",
          "ol",
          "li",
          "a",
        ],
        allowedAttributes: { a: ["href", "target"] },
      });

      await prisma.job.update({
        where: { id: id },
        data: {
          title,
          location,
          salary,
          skills: skillArray,
          description: cleanDescription,
        },
      });

      res.redirect("/company/jobs?success=updated");
    } catch (error: any) {
      res.status(500).send("Lỗi cập nhật: " + error.message);
    }
  }

  // Xử lý xóa bài đăng
  static async postDeleteJob(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const companyId = req.user?.id;
      const existingJob = await prisma.job.findFirst({
        where: {
          id: id,
          companyId: companyId,
        },
      });

      if (!existingJob) {
        return res.status(404).send("Không có quyền xóa bài này!");
      }

      await prisma.job.delete({
        where: { id: id },
      });

      res.redirect("/company/jobs?success=deleted");
    } catch (error: any) {
      res.status(500).send("Lỗi xóa: " + error.message);
    }
  }
}
