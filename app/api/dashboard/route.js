// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get stats from database
    const [totalBlogs, totalPublications, recentBlogs, recentPosts] =
      await Promise.all([
        prisma.blog.count(),
        prisma.post.count(),
        prisma.blog.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, createdAt: true },
        }),
        prisma.post.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, createdAt: true },
        }),
      ]);

    return NextResponse.json({
      totalBlogs,
      totalPublications,
      recentBlogs,
      recentPosts,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard data' },
      { status: 500 }
    );
  }
}
