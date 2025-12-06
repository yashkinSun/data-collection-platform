import jwt from "jsonwebtoken";
import { ENV } from "./env";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import * as db from "../db";
import type { User } from "../../drizzle/schema";

export async function authenticateLocalRequest(req: Request): Promise<User | null> {
  // Парсинг cookie
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    return null;
  }

  try {
    // Проверка JWT
    const decoded = jwt.verify(token, ENV.jwtSecret) as { userId: number; email: string };

    // Получение пользователя из БД
    const user = await db.getUserByEmail(decoded.email);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.warn("[LocalAuth] Token verification failed:", String(error));
    return null;
  }
}
