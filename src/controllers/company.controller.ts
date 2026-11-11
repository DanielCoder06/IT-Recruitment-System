import { Request, Response } from "express";

export class CompanyController {
  static getDashboard(req: Request, res: Response) {
    res.render("company/dashboard", {
      title: "Dashboard Công ty",
      user: req.user,
    });
  }

  // Hiển thị danh sách blog jobs
  static getJobs(req: Request, res: Response) {
    res.render("company/jobs", {
      title: "Quản lý bài đăng",
      user: req.user,
      job: [],
    });
  }

  // Giao diện tạo bài đăng
  static getCreateJobPage(req: Request, res: Response) {
    res.render("company/create-job", {
      title: "Đăng bài mới",
      user: req.user,
    });
  }
}
