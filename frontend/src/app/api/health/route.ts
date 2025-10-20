/**
 * Health Check API Route
 * GET /api/health
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    amadeusConfigured: !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET),
  });
}

export const dynamic = 'force-dynamic';
