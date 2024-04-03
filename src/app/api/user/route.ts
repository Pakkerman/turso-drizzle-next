import { NextResponse } from "next/server";
import { selectAll, insertUser } from "@/functions/user";
import { SelectUser } from "@/db/schema";

export async function GET(request: Request) {
  const users = await selectAll();
  return NextResponse.json(users);
}

export async function POST(request: Request): Promise<NextResponse> {
  const data = await request.json();

  const response = await insertUser(data);
  console.log(response);
  return NextResponse.json({ message: response }, { status: 200 });
}
