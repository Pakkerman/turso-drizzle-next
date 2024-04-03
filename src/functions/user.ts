import { db } from "@/db/db";
import { InsertUser, SelectUser, users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function insertUser(data: InsertUser): Promise<string> {
  try {
    await db.insert(users).values(data);
    return `Successfully insert user: ${data.name}`;
  } catch (error) {
    return error as string;
  }
}

export async function selectAll(): Promise<Array<SelectUser>> {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function deleteAll(): Promise<void> {
  await db.delete(users);
}
