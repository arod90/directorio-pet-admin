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
    console.log('Fetching dashboard data...');

    const publicationsCount = await prisma.post.count();
    console.log('Total publications found:', publicationsCount);

    const [
      totalBlogs,
      totalUsers,
      recentBlogs,
      recentPosts,
      databaseStatus,
      apiStatus,
      contentStatus,
    ] = await Promise.all([
      prisma.blog.count(),
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

    console.log('Recent posts found:', recentPosts.length);

    const response = NextResponse.json({
      totalBlogs,
      totalPublications: publicationsCount,
      totalUsers,
      recentBlogs,
      recentPosts,
      systemStatus: {
        database: databaseStatus,
        api: apiStatus,
        contentDelivery: contentStatus,
      },
    });

    // Add headers to prevent caching
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    const errorResponse = NextResponse.json(
      {
        error: 'Error fetching dashboard data',
        details: error.message,
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
      },
      { status: 500 }
    );

    // Add same cache prevention headers to error response
    errorResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');

    return errorResponse;
  } finally {
    await prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
