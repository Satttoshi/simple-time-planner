import { NextResponse } from 'next/server';
import dbConnect from '@/db/connect';
import { Week } from '@/db/models';
import { DayData, WeekData } from '@/types';

// api/day?date=<date-in-iso-format>
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  try {
    await dbConnect();

    if (!date) {
      return NextResponse.json(
        { error: 'No date provided as query parameter' },
        { status: 400 },
      );
    }

    console.log('fetching day data ...');
    //
    const weekData: WeekData | null = await Week.findOne(
      { 'days.date': date },
      { 'days.$': 1 },
    );

    if (!weekData) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const dayData = weekData.days.filter(
      (day: DayData) => day.date === date,
    )[0];

    if (!dayData) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(dayData);
  } catch (error) {
    console.error('Error fetching day data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}

// api/day?date=<date-in-iso-format>
export async function POST(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  try {
    await dbConnect();

    if (!date) {
      return NextResponse.json(
        { error: 'No date provided as query parameter' },
        { status: 400 },
      );
    }

    const newDayData: DayData = await request.json();

    const weekData: WeekData | null = await Week.findOne(
      { 'days.date': date },
      { 'days.$': 1 },
    );

    if (!weekData) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const dayData: DayData = weekData.days.filter(
      (day: DayData) => day.date === date,
    )[0];

    if (!dayData) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update the specific day within the week
    const result = await Week.updateOne(
      { 'days.date': date }, // Find the week containing the specific day
      {
        $set: {
          'days.$': newDayData, // Update only the day that matches the date
        },
      },
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error loading day data:', error);
    return NextResponse.json(
      { error: 'Failed to load day data' },
      { status: 500 },
    );
  }
}
