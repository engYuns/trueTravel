/**
 * API Route: Flight Search
 * POST /api/flights/search
 * 
 * Searches for flights using Amadeus API
 */

import { NextRequest, NextResponse } from 'next/server';
import { amadeusService, transformFlightOffer } from '@/lib/amadeusService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required parameters
    if (!body.originLocationCode || !body.destinationLocationCode || !body.departureDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;
    const apiEndpoint = process.env.AMADEUS_API_ENDPOINT || 'https://test.api.amadeus.com';

    if (!apiKey || !apiSecret) {
      console.error('Amadeus API credentials not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Map cabin class
    const cabinMap: Record<string, string> = {
      'Economy': 'ECONOMY',
      'Premium Economy': 'PREMIUM_ECONOMY',
      'Business': 'BUSINESS',
      'First Class': 'FIRST',
    };

    // Prepare search parameters
    const searchParams = {
      originLocationCode: body.originLocationCode,
      destinationLocationCode: body.destinationLocationCode,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      adults: body.adults || 1,
      children: body.children || 0,
      infants: body.infants || 0,
      travelClass: cabinMap[body.travelClass] as any,
      nonStop: body.nonStop || false,
      currencyCode: body.currencyCode || 'USD',
      maxResults: body.maxResults || 50,
    };

    console.log('Searching flights with params:', searchParams);

    // Call Amadeus API
    const response = await amadeusService.searchFlights(searchParams, {
      apiKey,
      apiSecret,
      apiEndpoint,
    });

    // Transform results
    const flights = response.data?.map((offer: any, index: number) => 
      transformFlightOffer(offer, index)
    ) || [];

    console.log(`Found ${flights.length} flights`);

    return NextResponse.json({
      success: true,
      data: flights,
      meta: response.meta,
    });

  } catch (error: any) {
    console.error('Flight search error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to search flights',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
