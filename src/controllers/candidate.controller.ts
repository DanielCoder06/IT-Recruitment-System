import { Request, Response } from "express";

export class CandidateController {
  static getDashboard(req: Request, res: Response) {
    res.render("candidate/dashboard", {
      title: "Dashboard Ứng viên",
      user: req.user,
    });
  }
}
