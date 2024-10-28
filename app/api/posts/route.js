// app/api/posts/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        subcategories: true,
        imageUrl: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const {
      id,
      name,
      title,
      description,
      categoryName,
      city,
      hood,
      phone,
      instagram,
      facebook,
      tikTok,
      delivery,
      price,
      promotion,
      latitude,
      longitude,
      imageUrls,
      userId, // Make sure this matches the existing userId
    } = data;

    // First, delete existing images
    await prisma.image.deleteMany({
      where: { postId: id },
    });

    // Then update the post and create new images
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        name,
        title,
        description,
        categoryName,
        city,
        hood,
        phone,
        instagram,
        facebook,
        tikTok,
        delivery,
        price: price ? parseFloat(price) : null,
        promotion: promotion || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        // Create new images
        imageUrl: {
          create: imageUrls
            .filter((url) => url)
            .map((url) => ({
              url,
            })),
        },
      },
      include: {
        category: true,
        subcategories: true,
        imageUrl: true,
        user: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: `Error updating post: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    // Handle post creation
    const newPost = await prisma.post.create({
      data: {
        // ... your existing post creation logic
      },
    });
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: 'Error deleting publication' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
