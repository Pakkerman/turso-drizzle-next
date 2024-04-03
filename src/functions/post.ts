import { db } from "@/db/db";
import { InsertPost, posts } from "@/db/schema";

export async function insertPost(data: InsertPost): Promise<void> {
  await db.insert(posts).values(data);
}
