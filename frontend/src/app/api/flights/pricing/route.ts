/**
 * API Route: Flight Offer Pricing
 * POST /api/flights/pricing
 *
 * Confirms/prices selected flight offers using Amadeus Flight Offers Pricing endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { amadeusService } from '@/lib/amadeusService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const outboundOffer = body?.outboundOffer;
    const returnOffer = body?.returnOffer;

    if (!outboundOffer) {
      return NextResponse.json({ error: 'Missing outboundOffer' }, { status: 400 });
    }

    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;
    const apiEndpoint = process.env.AMADEUS_API_ENDPOINT || 'https://test.api.amadeus.com';

    if (!apiKey || !apiSecret) {
      console.error('Amadeus API credentials not configured. Please add AMADEUS_API_KEY and AMADEUS_API_SECRET to environment variables.');
      return NextResponse.json(
        {
          error: 'API credentials not configured',
          message: 'Please configure Amadeus API credentials in environment variables',
        },
        { status: 503 }
      );
    }

    const config = { apiKey, apiSecret, apiEndpoint };

    const outboundPricing = await amadeusService.getFlightPrice(outboundOffer, config);
    const returnPricing = returnOffer ? await amadeusService.getFlightPrice(returnOffer, config) : null;

    return NextResponse.json({
      success: true,
      outbound: outboundPricing,
      return: returnPricing,
    });
  } catch (error: any) {
    console.error('Flight pricing error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to price flight offer',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
