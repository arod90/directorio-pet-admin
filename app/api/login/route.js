import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  const { username, password } = await request.json();

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 400 }
    );
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 400 }
    );
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const response = NextResponse.json(
    { message: 'Login successful' },
    { status: 200 }
  );
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
