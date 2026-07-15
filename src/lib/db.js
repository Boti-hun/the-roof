import fs from 'fs/promises';
import path from 'path';

// ── Mode Detection ──────────────────────────────────────────────────────────
const useKV = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);

// ── KV (Vercel KV / Upstash Redis) helpers ──────────────────────────────────
function getKVUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
}

function getKVToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
}

async function kvGet(key) {
  const url = getKVUrl();
  const token = getKVToken();

  try {
    const res = await fetch(`${url}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', key]),
      cache: 'no-store'
    });

    const json = await res.json();
    if (!json.result) return null;
    return JSON.parse(json.result);
  } catch (err) {
    console.error('KV Get Error:', err);
    return null;
  }
}

async function kvSet(key, value) {
  const url = getKVUrl();
  const token = getKVToken();

  await fetch(`${url}/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', key, JSON.stringify(value)]),
  });
}

// ── Local JSON file helpers ─────────────────────────────────────────────────
const DATA_PATH = path.join(process.cwd(), 'data', 'reservations.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// ── Exported data-access functions ──────────────────────────────────────────

/**
 * Gibt alle Reservierungen zurück, sortiert nach Datum absteigend.
 */
export async function getReservations() {
  let reservations;

  if (useKV) {
    reservations = (await kvGet('reservations')) || [];
  } else {
    reservations = await readData();
  }

  if (!Array.isArray(reservations)) {
    console.error('Data corrupted, resetting reservations array.');
    reservations = [];
  }

  return reservations.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Erstellt eine neue Reservierung und gibt sie zurück.
 */
export async function addReservation(data) {
  const reservation = {
    id: Date.now().toString(),
    service: data.service,
    date: data.date,
    timePreference: data.timePreference,
    location: data.location,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    message: data.message,
    status: 'Neu',
    createdAt: new Date().toISOString(),
  };

  let reservations;

  if (useKV) {
    reservations = (await kvGet('reservations')) || [];
  } else {
    reservations = await readData();
  }

  if (!Array.isArray(reservations)) {
    reservations = [];
  }

  reservations.push(reservation);

  if (useKV) {
    await kvSet('reservations', reservations);
  } else {
    await writeData(reservations);
  }

  return reservation;
}

/**
 * Aktualisiert den Status einer Reservierung anhand der ID.
 * Gibt die aktualisierte Reservierung zurück oder null, wenn nicht gefunden.
 */
export async function updateReservationStatus(id, status) {
  let reservations;

  if (useKV) {
    reservations = (await kvGet('reservations')) || [];
  } else {
    reservations = await readData();
  }

  if (!Array.isArray(reservations)) {
    return null;
  }

  const reservation = reservations.find((r) => String(r.id) === String(id));

  if (!reservation) return null;

  reservation.status = status;

  if (useKV) {
    await kvSet('reservations', reservations);
  } else {
    await writeData(reservations);
  }

  return reservation;
}
