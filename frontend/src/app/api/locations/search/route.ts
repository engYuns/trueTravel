/**
 * API Route: Location Search
 * GET /api/locations/search?keyword=istanbul
 * 
 * Searches for airports and cities using Amadeus API
 */

import { NextRequest, NextResponse } from 'next/server';
import { amadeusService, transformLocationResult } from '@/lib/amadeusService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'Keyword must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;
    const apiEndpoint = process.env.AMADEUS_API_ENDPOINT || 'https://test.api.amadeus.com';

    if (!apiKey || !apiSecret) {
      console.error('Amadeus API credentials not configured. Please add AMADEUS_API_KEY and AMADEUS_API_SECRET to Vercel environment variables.');
      return NextResponse.json(
        { 
          error: 'API credentials not configured',
          message: 'Please configure Amadeus API credentials in Vercel environment variables'
        },
        { status: 503 }
      );
    }

    console.log('Searching locations with keyword:', keyword);

    // Call Amadeus API
    const response = await amadeusService.searchLocations(
      {
        keyword: keyword,
        subType: ['AIRPORT', 'CITY'],
      },
      {
        apiKey,
        apiSecret,
        apiEndpoint,
      }
    );

    // Transform results
    const locations = response.data?.map((location: any) => 
      transformLocationResult(location)
    ) || [];

    console.log(`Found ${locations.length} locations`);

    return NextResponse.json({
      success: true,
      data: locations,
    });

  } catch (error: any) {
    console.error('Location search error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to search locations',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
