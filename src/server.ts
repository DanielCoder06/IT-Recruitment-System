import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "./configs/prisma.client";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";

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

app.use("/auth", authRoute);

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
