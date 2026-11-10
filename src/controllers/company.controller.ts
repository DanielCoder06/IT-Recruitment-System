import { Request, Response } from "express";

export class CompanyController {
  static getDashboard(req: Request, res: Response) {
    res.render("company/dashboard", {
      title: "Dashboard Công ty",
      user: req.user,
    });
  }
}
