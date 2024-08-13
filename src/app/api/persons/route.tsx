import dbConnect from '@/db/connect';
import Person from '@/db/models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    console.log('fetching all persons ...');
    const persons = await Person.find();

    if (!persons) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}
