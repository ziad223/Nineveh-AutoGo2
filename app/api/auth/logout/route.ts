import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out' });

  // Remove the 'token' cookie by clearing its value and setting an expired date
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    path: '/',
    expires: new Date(0), // This removes it
  });

  return response;
}
