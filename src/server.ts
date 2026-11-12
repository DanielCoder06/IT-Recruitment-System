import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "./configs/prisma.client";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";
import dashboardRoute from "./routes/dashboard.route";
import jwt from "jsonwebtoken";
import { AdminController } from "./controllers/admin.controller";
import adminRoute from "./routes/admin.route";
import companyRoute from "./routes/company.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware kiểm tra token
app.use((req: Request, res: Response, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      // Giải mã token để lấy thông tin
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret",
      ) as any;
      res.locals.user = { id: decoded.userId, role: decoded.role };
    } catch (e) {
      // Token lỗi thì bỏ qua
    }
  }
  res.locals.currentPath = req.path;
  next();
});

app.use("/auth", authRoute);
app.use("/dashboard", dashboardRoute);
app.use("/admin", adminRoute);
app.use("/company", companyRoute);

app.get("/", (req: Request, res: Response) => {
  res.render("home", { title: "Trang chủ hệ thống" });
});

app.listen(port, async () => {
  try {
    console.log("Connected Database successfully!");
    console.log(`Sever is running on http://localhost:${port}`);
  } catch (error) {
    console.log("Error");
  }
});
