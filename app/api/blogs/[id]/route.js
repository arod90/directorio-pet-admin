// app/api/blogs/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        tocItems: {
          orderBy: {
            order: 'asc',
          },
        },
        contentSections: {
          orderBy: {
            order: 'asc',
          },
        },
        faqs: {
          orderBy: {
            order: 'asc',
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Error fetching blog' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
