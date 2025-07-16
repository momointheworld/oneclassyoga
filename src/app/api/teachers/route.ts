import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        photo: true,
        styles: true,
        levels: true,
        bio: true,
        gallery: true,
        videoUrl: true,
        phone: true,
        email: true,
        lineId: true,
        createdAt: true,
        rate: true,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const created = await prisma.teacher.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        bio: data.bio,
        gallery: data.gallery || [],
        videoUrl: data.videoUrl || '',
        styles: data.styles,
        levels: data.levels,
        rate: data.rate,
        photo: data.photo,
        email: data.email,
        phone: data.phone,
        lineId: data.lineId,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
