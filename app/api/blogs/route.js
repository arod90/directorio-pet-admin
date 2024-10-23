// app/api/blogs/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Error fetching blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request) {
  try {
    const {
      title,
      metaTitle,
      metaDescription,
      introduction,
      categoryName,
      sections,
      faqs,
      conclusion,
      images,
    } = await request.json();

    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        metaTitle,
        metaDescription,
        introduction,
        conclusion,
        publishedAt: new Date(),
        category: {
          connect: { name: categoryName },
        },
        tocItems: {
          create: sections.map((section, index) => ({
            title: section.title,
            order: index,
          })),
        },
        contentSections: {
          create: sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            order: index,
          })),
        },
        faqs: {
          create: faqs.map((faq, index) => ({
            question: faq.question,
            answer: faq.answer,
            order: index,
          })),
        },
        images: {
          create: images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            order: index,
          })),
        },
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Error creating blog' }, { status: 500 });
  }
}

// PUT - Update blog
export async function PUT(request) {
  try {
    const {
      id,
      title,
      metaTitle,
      metaDescription,
      introduction,
      categoryName,
      sections,
      faqs,
      conclusion,
      images,
    } = await request.json();

    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    // Delete existing related records
    await prisma.$transaction([
      prisma.tableOfContents.deleteMany({ where: { blogId: id } }),
      prisma.contentSection.deleteMany({ where: { blogId: id } }),
      prisma.fAQ.deleteMany({ where: { blogId: id } }),
      prisma.blogImage.deleteMany({ where: { blogId: id } }),
    ]);

    // Update blog and create new related records
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        metaTitle,
        metaDescription,
        introduction,
        conclusion,
        category: {
          connect: { name: categoryName },
        },
        tocItems: {
          create: sections.map((section, index) => ({
            title: section.title,
            order: index,
          })),
        },
        contentSections: {
          create: sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            order: index,
          })),
        },
        faqs: {
          create: faqs.map((faq, index) => ({
            question: faq.question,
            answer: faq.answer,
            order: index,
          })),
        },
        images: {
          create: images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            order: index,
          })),
        },
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Error updating blog' }, { status: 500 });
  }
}

// DELETE - Delete blog
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Error deleting blog' }, { status: 500 });
  }
}
