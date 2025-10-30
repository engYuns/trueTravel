/**
 * Amadeus API Service
 * Handles authentication and API requests to Amadeus Self-Service APIs
 */

export interface AmadeusConfig {
  apiKey: string;
  apiSecret: string;
  apiEndpoint: string;
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  maxResults?: number;
}

export interface AirportSearchParams {
  keyword: string;
  subType?: string[];
}

class AmadeusService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get OAuth2 access token
   */
  async getAccessToken(config: AmadeusConfig): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${config.apiEndpoint}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.apiKey,
        client_secret: config.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to authenticate: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Set expiry to 5 minutes before actual expiry for safety
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken!;
  }

  /**
   * Search for flight offers
   */
  async searchFlights(
    params: FlightSearchParams,
    config: AmadeusConfig
  ): Promise<any> {
    const token = await this.getAccessToken(config);

    // Build query parameters
    const queryParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: (params.maxResults || 50).toString(),
      currencyCode: params.currencyCode || 'USD',
    });

    // Add optional parameters
    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }
    if (params.children && params.children > 0) {
      queryParams.append('children', params.children.toString());
    }
    if (params.infants && params.infants > 0) {
      queryParams.append('infants', params.infants.toString());
    }
    if (params.travelClass) {
      queryParams.append('travelClass', params.travelClass);
    }
    if (params.nonStop) {
      queryParams.append('nonStop', 'true');
    }

    const response = await fetch(
      `${config.apiEndpoint}/v2/shopping/flight-offers?${queryParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.errors?.[0]?.detail || `API Error: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Search for airports and cities by keyword
   */
  async searchLocations(
    params: AirportSearchParams,
    config: AmadeusConfig
  ): Promise<any> {
    const token = await this.getAccessToken(config);

    const queryParams = new URLSearchParams({
      keyword: params.keyword,
      subType: (params.subType || ['AIRPORT', 'CITY']).join(','),
    });

    const response = await fetch(
      `${config.apiEndpoint}/v1/reference-data/locations?${queryParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Location search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get flight price (for booking flow)
   */
  async getFlightPrice(
    flightOffer: any,
    config: AmadeusConfig
  ): Promise<any> {
    const token = await this.getAccessToken(config);

    const response = await fetch(
      `${config.apiEndpoint}/v1/shopping/flight-offers/pricing`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [flightOffer],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Flight pricing failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const amadeusService = new AmadeusService();

/**
 * Transform Amadeus flight offer to our UI format
 */
export function transformFlightOffer(offer: any, index: number) {
  const itinerary = offer.itineraries[0];
  const segment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const price = offer.price;

  // Calculate total duration
  const duration = itinerary.duration.replace('PT', '').toLowerCase();

  // Determine stops
  const stops = itinerary.segments.length === 1 
    ? 'Direct' 
    : `${itinerary.segments.length - 1} Stop${itinerary.segments.length > 2 ? 's' : ''}`;

  // Get airline info
  const carrierCode = segment.carrierCode;
  const flightNumber = `${segment.carrierCode} ${segment.number}`;
  
  // Get airline logo URL from multiple CDNs (Amadeus doesn't provide logos)
  // Using Airlabs.co as it has better coverage
  const logoUrl = `https://images.kiwi.com/airlines/64/${carrierCode}.png`;

  // Format times
  const departureTime = new Date(segment.departure.at).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const arrivalTime = new Date(lastSegment.arrival.at).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get cabin class
  const cabin = offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';
  const cabinMap: Record<string, string> = {
    ECONOMY: 'Economy',
    PREMIUM_ECONOMY: 'Premium Economy',
    BUSINESS: 'Business',
    FIRST: 'First Class',
  };

  // Get available seats
  const availableSeats = offer.numberOfBookableSeats || 9;

  return {
    id: index + 1,
    amadeus_id: offer.id,
    airline: getAirlineName(carrierCode),
    logo: logoUrl,
    carrierCode: carrierCode, // Keep carrier code for matching/comparison
    flightNumber: flightNumber,
    departure: {
      time: departureTime,
      airport: segment.departure.iataCode,
      date: segment.departure.at.split('T')[0],
    },
    arrival: {
      time: arrivalTime,
      airport: lastSegment.arrival.iataCode,
      date: lastSegment.arrival.at.split('T')[0],
    },
    duration: formatDuration(duration),
    stops: stops,
    price: parseFloat(price.total),
    currency: price.currency,
    class: cabinMap[cabin] || 'Economy',
    availability: `${availableSeats} seat${availableSeats > 1 ? 's' : ''} left`,
    originalOffer: offer, // Store for booking
  };
}

/**
 * Get airline name from carrier code
 */
function getAirlineName(carrierCode: string): string {
  const airlines: Record<string, string> = {
    TK: 'Turkish Airlines',
    IA: 'Iraqi Airways',
    PC: 'Pegasus Airlines',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    FZ: 'flydubai',
    WY: 'Oman Air',
    MS: 'EgyptAir',
    RJ: 'Royal Jordanian',
    KU: 'Kuwait Airways',
    LH: 'Lufthansa',
    BA: 'British Airways',
    AF: 'Air France',
    KL: 'KLM',
    // Add more airlines as needed
  };

  return airlines[carrierCode] || carrierCode;
}

/**
 * Format duration string
 */
function formatDuration(duration: string): string {
  const hours = duration.match(/(\d+)h/)?.[1] || '0';
  const minutes = duration.match(/(\d+)m/)?.[1] || '0';
  return `${hours}h ${minutes}m`;
}

/**
 * Transform location search result
 */
export function transformLocationResult(location: any) {
  const { iataCode, name, address } = location;
  const city = address?.cityName || '';
  const country = address?.countryName || '';
  
  return {
    code: iataCode,
    name: name,
    city: city,
    country: country,
    displayText: `${iataCode} - ${name}, ${city}, ${country}`,
  };
}
