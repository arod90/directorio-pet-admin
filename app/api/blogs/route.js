import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Error creating blog post' },
      { status: 500 }
    );
  }
}
