import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const spots = await prisma.travelSpot.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const spot = await prisma.travelSpot.create({
      data: body
    });
    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error creating spot:', error);
    return NextResponse.json({ error: 'Failed to create spot' }, { status: 500 });
  }
} 