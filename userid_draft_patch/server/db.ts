import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, submissions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Questionnaire submission queries

export async function createSubmission(userId: number, token: string, data: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.insert(submissions).values({
    userId,
    token,
    data,
    status: "draft",
  });
  
  return result;
}

export async function updateSubmission(token: string, data: string, status?: "draft" | "submitted") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const updateData: any = { data, updatedAt: new Date() };
  if (status) {
    updateData.status = status;
    if (status === "submitted") {
      updateData.submittedAt = new Date();
    }
  }
  
  await db.update(submissions)
    .set(updateData)
    .where(eq(submissions.token, token));
}

export async function getSubmissionByToken(token: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.select().from(submissions).where(eq(submissions.token, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSubmissions(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  return await db.select().from(submissions).where(eq(submissions.userId, userId));
}

export async function getDraftByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.select()
    .from(submissions)
    .where(and(
      eq(submissions.userId, userId),
      eq(submissions.status, "draft")
    ))
    .orderBy(desc(submissions.updatedAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// Local authentication queries

export async function createLocalUser(email: string, password: string, name: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.insert(users).values({
    email,
    password,
    name,
    loginMethod: "local",
    role: "user",
    lastSignedIn: new Date(),
  });
  
  return result;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignIn(userId: number) {
  const db = await getDb();
  if (!db) {
    return;
  }
  
  await db.update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, userId));
}

// Admin queries

export async function getAllSubmissions(status?: "draft" | "submitted") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  let query = db.select({
    id: submissions.id,
    userId: submissions.userId,
    token: submissions.token,
    data: submissions.data,
    status: submissions.status,
    createdAt: submissions.createdAt,
    updatedAt: submissions.updatedAt,
    submittedAt: submissions.submittedAt,
    userEmail: users.email,
    userName: users.name,
  })
  .from(submissions)
  .leftJoin(users, eq(submissions.userId, users.id));
  
  if (status) {
    query = query.where(eq(submissions.status, status)) as any;
  }
  
  return await query;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
