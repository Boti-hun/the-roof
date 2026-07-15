import { NextResponse } from 'next/server';
import { getReservations, addReservation } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reservations = await getReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('GET /api/reservations Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Reservierungen.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const requiredFields = [
      'service',
      'date',
      'timePreference',
      'location',
      'name',
      'email',
      'phone',
      'address',
    ];

    const missingFields = requiredFields.filter(
      (f) => !data[f] || data[f].trim() === ''
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Bitte füllen Sie alle Pflichtfelder aus.',
          missingFields,
        },
        { status: 400 }
      );
    }

    const reservation = await addReservation({
      service: data.service.trim(),
      date: data.date.trim(),
      timePreference: data.timePreference.trim(),
      location: data.location.trim(),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      message: data.message ? data.message.trim() : '',
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('POST /api/reservations Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Reservierung.' },
      { status: 500 }
    );
  }
}
