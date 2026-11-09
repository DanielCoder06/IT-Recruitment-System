import { prisma } from "../configs/prisma.client";
import { hashPassword } from "../utils/password.util";
import { UserRole } from "../generated/prisma/enums";

import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) {
    // 1 Check email có tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email này đã được sử dụng");
    }

    // 2 Mã hóa mật khẩu
    const hashedPassword = await hashPassword(data.password);

    // 3 Lưu user vào database
    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role,
      },
    });
  }

  static async login(email: string, password: string) {
    // 1 Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    // 2 So sán mật khẩu vừa nhập với mật khẩu đã được encryption trong db
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // 3 Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
