import { NextResponse } from 'next/server';
import { updateReservationStatus } from '@/lib/db';

const VALID_STATUSES = ['Neu', 'Bestätigt', 'Abgeschlossen', 'Storniert'];

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Ungültiger Status.' },
        { status: 400 }
      );
    }

    const updated = await updateReservationStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { error: 'Reservierung nicht gefunden.' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PATCH /api/reservations/${error} Fehler:`, error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Reservierung.' },
      { status: 500 }
    );
  }
}
