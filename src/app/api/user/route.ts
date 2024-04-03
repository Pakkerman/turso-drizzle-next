import { NextResponse } from "next/server";
import { selectAll, insertUser, deleteAll } from "@/functions/user";
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

export async function DELETE(request: Request): Promise<NextResponse> {
  const response = await deleteAll();
  console.log(response);
  return NextResponse.json({ message: response }, { status: 200 });
}
