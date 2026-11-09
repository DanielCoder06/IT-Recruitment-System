import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../generated/prisma/enums";
import { error } from "node:console";

export class AuthController {
  // 1 Render giao diện dăng ký tài khoản
  static getRegisterPage(req: Request, res: Response) {
    res.render("register", { title: "Đăng ký tài khoản" });
  }

  // 2 Xử lý dữ liệu khi nhấn nút đăng ký
  static async postRegister(req: Request, res: Response) {
    try {
      const { email, password, fullName, role } = req.body;
      if (!email || !password || !fullName) {
        return res.render("register", {
          title: "Đăng ký tài khoản",
          error: "Vui lòng nhập đầy đủ thông tin",
        });
      }

      const userRole =
        role === "COMPANY" ? UserRole.COMPANY : UserRole.CANDIDATE;

      await AuthService.register({ email, fullName, password, role });

      return res.redirect("/");
    } catch (error: any) {
      return res.render("register", {
        title: "Đăng ký tài khoản",
        error: error.message,
      });
    }
  }

  static getLoginPage(req: Request, res: Response) {
    res.render("login", { title: "Đăng nhập" });
  }

  // 2 Xử lý dữ liệu khi nhấn nút đăng ký
  static async postLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("login", {
          title: "Đăng nhập",
          error: "Vui lòng nhập đầy đủ thông tin",
        });
      }

      const { user, token } = await AuthService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.redirect("/");
    } catch (error: any) {
      return res.render("login", {
        title: "Đăng nhập",
        error: error.message,
      });
    }
  }
}
