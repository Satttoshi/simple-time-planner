import { NextResponse } from 'next/server';
import dbConnect from '@/db/connect';
import { Week } from '@/db/models';
import { WeekData } from '@/types';

// api/week?week=<number>
export async function GET(request: Request) {
  const url = new URL(request.url);
  const week = url.searchParams.get('week');

  try {
    await dbConnect();

    if (!week || isNaN(Number(week))) {
      // if there is no week query parameter, then return all weeks
      console.log('No Query parameter, fetching all weeks ...');
      const weeks: WeekData[] = await Week.find();

      if (!weeks) {
        return NextResponse.json({ error: 'No data found' }, { status: 404 });
      }

      return NextResponse.json(weeks);
    }

    const weekNumber = Number(week);

    console.log('fetching week data ...');
    const weekData: WeekData | null = await Week.findOne({ week: weekNumber });

    if (!weekData) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(weekData);
  } catch (error) {
    console.error('Error fetching week data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}

// api/week?week=<number>
export async function POST(request: Request) {
  const url = new URL(request.url);
  const week = url.searchParams.get('week');

  try {
    await dbConnect();

    if (!week || isNaN(Number(week))) {
      return NextResponse.json(
        { error: 'No week provided as query parameter' },
        { status: 400 },
      );
    }

    const weekNumber = Number(week);
    const weekData = await request.json();

    if (
      !Array.isArray(weekData.days) ||
      weekData.days.length === 0 ||
      weekData.week !== weekNumber
    ) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await Week.deleteOne({ week: weekNumber });

    // Insert new week data into the database
    const insertedWeek = await Week.create({
      week: weekNumber,
      days: weekData.days,
    });

    return NextResponse.json(insertedWeek, { status: 201 });
  } catch (error) {
    console.error('Error loading week data:', error);
    return NextResponse.json(
      { error: 'Failed to load week data' },
      { status: 500 },
    );
  }
}
