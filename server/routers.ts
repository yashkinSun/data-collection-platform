import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createSubmission, updateSubmission, getSubmissionByToken, getUserSubmissions, createLocalUser, getUserByEmail, updateUserLastSignIn, getAllSubmissions, getUserById, getDraftByUserId } from "./db";
import { hashPassword, verifyPassword } from "./auth";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    // Локальная регистрация
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        // Проверка существования пользователя
        const existingUser = await getUserByEmail(input.email);
        if (existingUser) {
          throw new Error("Пользователь с таким email уже существует");
        }
        
        // Хеширование пароля
        const hashedPassword = await hashPassword(input.password);
        
        // Создание пользователя
        await createLocalUser(input.email, hashedPassword, input.name);
        
        // Получение созданного пользователя
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new Error("Ошибка создания пользователя");
        }
        
        // Создание JWT токена
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          ENV.jwtSecret,
          { expiresIn: "30d" }
        );
        
        // Установка cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }),
    
    // Локальный вход
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Поиск пользователя
        const user = await getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new Error("Неверный email или пароль");
        }
        
        // Проверка пароля
        const isValidPassword = await verifyPassword(input.password, user.password);
        if (!isValidPassword) {
          throw new Error("Неверный email или пароль");
        }
        
        // Обновление времени последнего входа
        await updateUserLastSignIn(user.id);
        
        // Создание JWT токена
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          ENV.jwtSecret,
          { expiresIn: "30d" }
        );
        
        // Установка cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }),
  }),

  // Questionnaire router
  questionnaire: router({
    // Получить черновик пользователя (или создать новый)
    getMyDraft: protectedProcedure.query(async ({ ctx }) => {
      // Проверяем, есть ли у пользователя черновик
      const existingDraft = await getDraftByUserId(ctx.user.id);
      
      if (existingDraft) {
        return {
          token: existingDraft.token,
          data: JSON.parse(existingDraft.data),
          updatedAt: existingDraft.updatedAt,
        };
      }
      
      // Если черновика нет, создаем новый
      const { v4: uuidv4 } = await import("uuid");
      const token = uuidv4();
      const initialData = JSON.stringify({});
      
      await createSubmission(ctx.user.id, token, initialData);
      
      return {
        token,
        data: {},
        updatedAt: new Date(),
      };
    }),
    
    // Создать новый черновик опросника (устаревший, оставлен для совместимости)
    create: protectedProcedure.mutation(async ({ ctx }) => {
      const { v4: uuidv4 } = await import("uuid");
      const token = uuidv4();
      const initialData = JSON.stringify({});
      
      await createSubmission(ctx.user.id, token, initialData);
      
      return { token };
    }),
    
    // Получить данные по токену
    get: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const submission = await getSubmissionByToken(input.token);
        if (!submission) {
          throw new Error("Опросник не найден");
        }
        
        return {
          id: submission.id,
          token: submission.token,
          data: JSON.parse(submission.data),
          status: submission.status,
          updatedAt: submission.updatedAt,
        };
      }),
    
    // Сохранить черновик (автосохранение)
    save: publicProcedure
      .input(z.object({ 
        token: z.string(), 
        data: z.any() 
      }))
      .mutation(async ({ input }) => {
        const dataString = JSON.stringify(input.data);
        await updateSubmission(input.token, dataString, "draft");
        
        return { success: true };
      }),
    
    // Отправить заполненный опросник
    submit: publicProcedure
      .input(z.object({ 
        token: z.string(), 
        data: z.any() 
      }))
      .mutation(async ({ input }) => {
        const dataString = JSON.stringify(input.data);
        await updateSubmission(input.token, dataString, "submitted");
        
        // Сохранить в файлы JSON и CSV
        const { saveSubmissionJSON, appendSubmissionCSV } = await import("./fileStorage");
        try {
          await saveSubmissionJSON(input.token, input.data);
          await appendSubmissionCSV(input.data);
        } catch (error) {
          console.error("Ошибка при сохранении файлов:", error);
        }
        
        return { success: true };
      }),
    
    // Получить список опросников пользователя
    list: protectedProcedure.query(async ({ ctx }) => {
      const submissions = await getUserSubmissions(ctx.user.id);
      
      return submissions.map(s => ({
        id: s.id,
        token: s.token,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        submittedAt: s.submittedAt,
      }));
    }),
    
    // Экспорт в JSON
    exportJSON: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const submission = await getSubmissionByToken(input.token);
        if (!submission) {
          throw new Error("Опросник не найден");
        }
        
        return {
          data: JSON.parse(submission.data),
          json: JSON.stringify(JSON.parse(submission.data), null, 2),
        };
      }),
    
    // Экспорт в CSV
    exportCSV: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const submission = await getSubmissionByToken(input.token);
        if (!submission) {
          throw new Error("Опросник не найден");
        }
        
        const { generateCSV } = await import("./pdfExport");
        const data = JSON.parse(submission.data);
        const csv = generateCSV(data);
        
        return { csv };
      }),
    
    // Экспорт в PDF (текстовый формат)
    exportPDF: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const submission = await getSubmissionByToken(input.token);
        if (!submission) {
          throw new Error("Опросник не найден");
        }
        
        const { generatePDFSimple } = await import("./pdfExport");
        const data = JSON.parse(submission.data);
        const pdfText = await generatePDFSimple(data);
        
        return { pdfText };
      }),
  }),
  
  // Админ роутер
  admin: router({
    // Получить все опросники (только для admin)
    getAllSubmissions: protectedProcedure
      .input(z.object({
        status: z.enum(["draft", "submitted"]).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Проверка роли admin
        if (ctx.user.role !== "admin") {
          throw new Error("Доступ запрещён. Требуется роль администратора.");
        }
        
        const submissions = await getAllSubmissions(input?.status);
        
        return submissions.map(s => ({
          id: s.id,
          userId: s.userId,
          token: s.token,
          status: s.status,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          submittedAt: s.submittedAt,
          userEmail: s.userEmail,
          userName: s.userName,
          // Извлекаем ФИО респондента из JSON
          respondentName: (() => {
            try {
              const data = JSON.parse(s.data as string);
              return data?.respondent?.fullName || "Не указано";
            } catch {
              return "Ошибка данных";
            }
          })(),
        }));
      }),
    
    // Получить конкретный опросник по токену (только для admin)
    getSubmission: protectedProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ ctx, input }) => {
        // Проверка роли admin
        if (ctx.user.role !== "admin") {
          throw new Error("Доступ запрещён. Требуется роль администратора.");
        }
        
        const submission = await getSubmissionByToken(input.token);
        if (!submission) {
          throw new Error("Опросник не найден");
        }
        
        const user = await getUserById(submission.userId);
        
        return {
          id: submission.id,
          userId: submission.userId,
          token: submission.token,
          data: JSON.parse(submission.data),
          status: submission.status,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
          submittedAt: submission.submittedAt,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
          } : null,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
