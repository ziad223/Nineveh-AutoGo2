import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token, userId,type , userDataInfo} = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

 
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2, 
  });
  cookies().set({
    name: "userId",
    value: userId,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2, 
  });
    cookies().set({
    name: "userDataInfo",
    value: JSON.stringify(userDataInfo),
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2, 
  });
  cookies().set({
    name: "client_type",
    value: type,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2, 
  });

  return NextResponse.json({ message: "Token stored successfully" });
}
