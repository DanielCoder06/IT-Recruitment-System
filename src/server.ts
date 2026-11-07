import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./configs/prisma.client";
import { error } from "node:console";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  try {
    console.log("Connected Database successfully!");
    console.log(`Sever is running on http://localhost:${port}`);
  } catch (error) {
    console.log("Error");
  }
});
