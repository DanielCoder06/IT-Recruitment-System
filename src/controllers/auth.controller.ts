import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../generated/prisma/enums";
import { error } from "node:console";

export class AuthController {
  // 1 Render giao diện dăng ký tài khoản
  static getRegisterPage(req: Request, res: Response) {
    res.render("auth/register", { title: "Đăng ký tài khoản" });
  }

  // 2 Xử lý dữ liệu khi nhấn nút đăng ký
  static async postRegister(req: Request, res: Response) {
    try {
      const { email, password, fullName, role } = req.body;
      //Kiểm tra thong tin
      if (!email || !password || !fullName) {
        return res.render("auth/register", {
          title: "Đăng ký tài khoản",
          error: "Vui lòng nhập đầy đủ thông tin",
        });
      }

      // Kiểm tra vai trò
      const userRole =
        role === "COMPANY" ? UserRole.COMPANY : UserRole.CANDIDATE;

      // Lưu thông tin người dùng vào db
      await AuthService.register({ email, fullName, password, role: userRole });

      // Tạo token khi vừa đăng ký xong
      const { user, token } = await AuthService.login(email, password);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      if (user.role === "COMPANY") {
        return res.redirect("/company/dashboard");
      }

      if (user.role === "CANDIDATE") {
        return res.redirect("/candidate/dashboard");
      }
    } catch (error: any) {
      return res.render("register", {
        title: "Đăng ký tài khoản",
        error: error.message,
      });
    }
  }

  // 1 Render giao diện dăng nhập
  static getLoginPage(req: Request, res: Response) {
    res.render("auth/login", { title: "Đăng nhập" });
  }

  // 2 Xử lý dữ liệu khi nhấn nút đăng nhập
  static async postLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("auth/login", {
          title: "Đăng nhập",
          error: "Vui lòng nhập đầy đủ thông tin",
        });
      }

      const { user, token } = await AuthService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      if (user.role === "ADMIN") {
        return res.redirect("/admin/users"); // Admin vào thẳng quản lý user
      }
      if (user.role === "COMPANY") {
        return res.redirect("/company/dashboard"); // company/dashboard
      }
      if (user.role === "CANDIDATE") {
        return res.redirect("/candidate/dashboard"); // candidate/dashboard
      }

      // Mặc định cho Ứng viên (CANDIDATE)
      return res.redirect("/dashboard");
    } catch (error: any) {
      return res.render("auth/login", {
        title: "Đăng nhập",
        error: error.message,
      });
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.redirect("/");
  }
}
