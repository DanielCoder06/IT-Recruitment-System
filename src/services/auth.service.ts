import { prisma } from "../configs/prisma.client";
import { hashPassword } from "../utils/password.util";
import { UserRole } from "../generated/prisma/enums";

export class AuthService {
  static async register(data: {
    email: "string";
    password: "string";
    fullName: "string";
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
}
