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

export async function POST(request: any) {
  try {
    await dbConnect();

    const persons = await request.json();

    if (!Array.isArray(persons) || persons.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await Person.deleteMany({});

    // Insert new persons into the database
    const insertedPersons = await Person.insertMany(persons);

    return NextResponse.json(insertedPersons, { status: 201 });
  } catch (error) {
    console.error('Error loading persons:', error);
    return NextResponse.json(
      { error: 'Failed to load persons' },
      { status: 500 },
    );
  }
}
