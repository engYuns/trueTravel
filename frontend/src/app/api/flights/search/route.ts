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

    const preferredAirlinesRaw =
      (Array.isArray(body?.preferredAirlines) && body.preferredAirlines) ||
      (Array.isArray(body?.includedAirlineCodes) && body.includedAirlineCodes) ||
      [];
    const includedAirlineCodes = Array.isArray(preferredAirlinesRaw)
      ? preferredAirlinesRaw
          .map((c: any) => String(c || '').trim().toUpperCase())
          .filter(Boolean)
      : [];

    const hasSegments = Array.isArray(body?.segments) && body.segments.length > 0;

    // Validate required parameters
    if (!hasSegments && (!body.originLocationCode || !body.destinationLocationCode || !body.departureDate)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (hasSegments) {
      if (body.segments.length < 2) {
        return NextResponse.json(
          { error: 'Multipoint search requires at least 2 segments' },
          { status: 400 }
        );
      }

      const invalid = body.segments.find((s: any) => {
        const from = String(s?.originLocationCode ?? s?.from ?? '').trim();
        const to = String(s?.destinationLocationCode ?? s?.to ?? '').trim();
        const date = String(s?.departureDate ?? '').trim();
        return !from || !to || !date;
      });

      if (invalid) {
        return NextResponse.json(
          { error: 'Each segment must include from/to and departureDate' },
          { status: 400 }
        );
      }
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

    // Map cabin class
    const cabinMap: Record<string, string> = {
      'Economy': 'ECONOMY',
      'Premium Economy': 'PREMIUM_ECONOMY',
      'Business': 'BUSINESS',
      'First Class': 'FIRST',
    };

    const baseSearchParams = {
      adults: body.adults || 1,
      children: body.children || 0,
      infants: body.infants || 0,
      travelClass: cabinMap[body.travelClass] as any,
      nonStop: body.nonStop || false,
      currencyCode: body.currencyCode || 'USD',
      maxResults: body.maxResults || 50,
      includedAirlineCodes: includedAirlineCodes.length > 0 ? includedAirlineCodes : undefined,
    };

    const resolveCarriers = async (amadeusResponse: any, carriersSeed?: Record<string, string>) => {
      const carriers: Record<string, string> = {
        ...(carriersSeed || {}),
        ...(amadeusResponse?.dictionaries?.carriers || {}),
      };

      const carrierCodesInResults = Array.from(
        new Set(
          (amadeusResponse?.data || [])
            .flatMap((offer: any) => (offer?.itineraries || []).flatMap((it: any) => it?.segments || []))
            .flatMap((seg: any) => [seg?.carrierCode, seg?.operating?.carrierCode])
            .filter(Boolean)
            .map((c: any) => String(c).toUpperCase())
        )
      );

      const missingCarrierCodes = carrierCodesInResults.filter((code) => !carriers?.[code]);
      if (missingCarrierCodes.length > 0) {
        const lookedUp = await amadeusService.lookupAirlines(missingCarrierCodes, {
          apiKey,
          apiSecret,
          apiEndpoint,
        });
        for (const [code, name] of Object.entries(lookedUp || {})) {
          if (!carriers[code] && name) carriers[code] = name;
        }
      }

      return carriers;
    };

    if (hasSegments) {
      const legs: Array<{ segment: any; flights: any[]; meta?: any }> = [];
      let carriersAggregate: Record<string, string> = {};

      for (let i = 0; i < body.segments.length; i++) {
        const seg = body.segments[i];
        const originLocationCode = String(seg?.originLocationCode ?? seg?.from ?? '').split(' - ')[0].trim();
        const destinationLocationCode = String(seg?.destinationLocationCode ?? seg?.to ?? '').split(' - ')[0].trim();
        const departureDate = String(seg?.departureDate ?? '').trim();

        const searchParams = {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          ...baseSearchParams,
        };

        console.log('Searching multipoint leg', i + 1, 'with params:', searchParams);

        const response = await amadeusService.searchFlights(searchParams as any, {
          apiKey,
          apiSecret,
          apiEndpoint,
        });

        carriersAggregate = await resolveCarriers(response, carriersAggregate);

        const flights = response.data?.map((offer: any, index: number) =>
          transformFlightOffer(offer, index, carriersAggregate)
        ) || [];

        legs.push({
          segment: { originLocationCode, destinationLocationCode, departureDate },
          flights,
          meta: response?.meta,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          mode: 'Multipoint',
          legs,
        },
        dictionaries: {
          carriers: carriersAggregate,
        },
      });
    }

    // Prepare search parameters
    const searchParams = {
      originLocationCode: body.originLocationCode,
      destinationLocationCode: body.destinationLocationCode,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      ...baseSearchParams,
    };

    console.log('Searching flights with params:', searchParams);

    // Call Amadeus API
    const response = await amadeusService.searchFlights(searchParams, {
      apiKey,
      apiSecret,
      apiEndpoint,
    });

    const carriers = await resolveCarriers(response);

    // Transform results
    const flights = response.data?.map((offer: any, index: number) =>
      transformFlightOffer(offer, index, carriers)
    ) || [];

    console.log(`Found ${flights.length} flights`);

    return NextResponse.json({
      success: true,
      data: flights,
      meta: response.meta,
      dictionaries: {
        ...(response.dictionaries || {}),
        carriers,
      },
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

export const dynamic = 'force-dynamic';
