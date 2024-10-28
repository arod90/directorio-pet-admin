// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        imageUrl: true,
        category: true,
        subcategories: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching publication:', error);
    return NextResponse.json(
      { error: 'Error fetching publication' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
