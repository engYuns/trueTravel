export type MultiPointSegment = {
  from: string;
  to: string;
  departureDate: string;
};

export type FlightSearchCriteria = {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  segments?: MultiPointSegment[];
  adults: number;
  children: number;
  infants: number;
  flightClass: string;
  tripType: string;
  markup: string;
  markupType: 'fixed' | 'percentage';
  isDirect: boolean;
  corporateCode?: string;
  preferredAirlines?: string[];
};

export type FlightSearchResult = {
  success: boolean;
  data?: unknown;
  message?: string;
};

export function buildFlightResultSearchParams(criteria: FlightSearchCriteria): URLSearchParams {
  const firstSeg = Array.isArray(criteria.segments) && criteria.segments.length > 0 ? criteria.segments[0] : null;
  const fromSource = firstSeg?.from ?? criteria.from;
  const toSource = firstSeg?.to ?? criteria.to;
  const departureDateSource = firstSeg?.departureDate ?? criteria.departureDate;

  const fromCode = String(fromSource || '').split(' - ')[0].trim();
  const toCode = String(toSource || '').split(' - ')[0].trim();

  const searchParams = new URLSearchParams({
    from: fromCode,
    to: toCode,
    departureDate: departureDateSource,
    adults: String(criteria.adults),
    children: String(criteria.children),
    infants: String(criteria.infants),
    flightClass: criteria.flightClass,
    tripType: criteria.tripType,
    markup: criteria.markup,
    markupType: criteria.markupType,
    isDirect: String(criteria.isDirect),
  });

  if (criteria.corporateCode) {
    searchParams.set('corporateCode', String(criteria.corporateCode));
  }
  if (Array.isArray(criteria.preferredAirlines) && criteria.preferredAirlines.length > 0) {
    searchParams.set('preferredAirlines', criteria.preferredAirlines.join(','));
  }

  if (criteria.tripType === 'Roundtrip' && criteria.returnDate) {
    searchParams.set('returnDate', criteria.returnDate);
  }

  if (criteria.tripType === 'Multipoint' && Array.isArray(criteria.segments) && criteria.segments.length > 0) {
    const encoded = criteria.segments
      .map((s) => {
        const a = String(s.from || '').split(' - ')[0].trim();
        const b = String(s.to || '').split(' - ')[0].trim();
        const d = String(s.departureDate || '').trim();
        return [a, b, d].join('~');
      })
      .join('|');
    searchParams.set('segments', encoded);
  }

  return searchParams;
}

export async function performFlightSearch(criteria: FlightSearchCriteria): Promise<{ searchParams: URLSearchParams }>{
  const isMultipoint = String(criteria.tripType) === 'Multipoint';

  const firstSeg = Array.isArray(criteria.segments) && criteria.segments.length > 0 ? criteria.segments[0] : null;
  const fromSource = firstSeg?.from ?? criteria.from;
  const toSource = firstSeg?.to ?? criteria.to;
  const departureDateSource = firstSeg?.departureDate ?? criteria.departureDate;

  const originLocationCode = String(fromSource || '').split(' - ')[0].trim();
  const destinationLocationCode = String(toSource || '').split(' - ')[0].trim();

  const response = await fetch('/api/flights/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      isMultipoint
        ? {
            segments: Array.isArray(criteria.segments) ? criteria.segments : [],
            adults: criteria.adults,
            children: criteria.children,
            infants: criteria.infants,
            travelClass: criteria.flightClass,
            nonStop: criteria.isDirect,
            preferredAirlines: Array.isArray(criteria.preferredAirlines) ? criteria.preferredAirlines : undefined,
            corporateCode: criteria.corporateCode,
            currencyCode: 'USD',
            maxResults: 50,
          }
        : {
            originLocationCode,
            destinationLocationCode,
            departureDate: departureDateSource,
            returnDate: criteria.tripType === 'Roundtrip' ? criteria.returnDate : undefined,
            adults: criteria.adults,
            children: criteria.children,
            infants: criteria.infants,
            travelClass: criteria.flightClass,
            nonStop: criteria.isDirect,
            preferredAirlines: Array.isArray(criteria.preferredAirlines) ? criteria.preferredAirlines : undefined,
            corporateCode: criteria.corporateCode,
            currencyCode: 'USD',
            maxResults: 50,
          }
    ),
  });

  const data = (await response.json()) as FlightSearchResult;

  if (!data.success || !data.data) {
    throw new Error(data.message || 'No flights found');
  }

  // Store search results + criteria for downstream pages.
  localStorage.setItem('flightSearchResults', JSON.stringify(data.data));
  localStorage.setItem('flightSearchCriteria', JSON.stringify(criteria));

  return { searchParams: buildFlightResultSearchParams(criteria) };
}
