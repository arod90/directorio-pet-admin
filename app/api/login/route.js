import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt for username:', username);

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      console.log('No admin found with username:', username);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400 }
      );
    }

    console.log('Admin found, comparing passwords...');
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      console.log('Password comparison failed');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error during login' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
