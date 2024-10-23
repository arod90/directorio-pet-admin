// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'operational', latency: 'good' };
  } catch (error) {
    console.error('Database connection check failed:', error);
    return { status: 'down', latency: 'bad' };
  }
}

async function checkAPIHealth() {
  try {
    await prisma.blog.findFirst();
    return { status: 'operational', latency: 'good' };
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'down', latency: 'bad' };
  }
}

async function checkContentDelivery() {
  try {
    await prisma.blog.findMany({ take: 1 });
    return { status: 'operational', latency: 'good' };
  } catch (error) {
    console.error('Content delivery check failed:', error);
    return { status: 'down', latency: 'bad' };
  }
}

export async function GET() {
  try {
    const [
      totalBlogs,
      totalPublications,
      totalUsers,
      recentBlogs,
      recentPosts,
      databaseStatus,
      apiStatus,
      contentStatus,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.post.count(),
      prisma.user.count(),
      prisma.blog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          categoryName: true,
        },
      }),
      checkDatabaseConnection(),
      checkAPIHealth(),
      checkContentDelivery(),
    ]);

    return NextResponse.json({
      totalBlogs,
      totalPublications,
      totalUsers,
      recentBlogs,
      recentPosts,
      systemStatus: {
        database: databaseStatus,
        api: apiStatus,
        contentDelivery: contentStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({
      totalBlogs: 0,
      totalPublications: 0,
      totalUsers: 0,
      recentBlogs: [],
      recentPosts: [],
      systemStatus: {
        database: { status: 'down', latency: 'bad' },
        api: { status: 'down', latency: 'bad' },
        contentDelivery: { status: 'down', latency: 'bad' },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
