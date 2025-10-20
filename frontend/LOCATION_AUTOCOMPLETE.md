# Location Autocomplete Feature

## Overview
Smart airport and city search with real-time suggestions powered by Amadeus API.

## How It Works

### User Experience
1. **Type to Search**: Start typing in "From" or "To" fields (minimum 2 characters)
2. **Instant Results**: See matching airports and cities in dropdown after 300ms delay
3. **Loading Indicator**: Spinning loader shows while fetching results
4. **Select Location**: Click any suggestion to populate the field
5. **Auto-format**: Selected location formats as "CODE - Name, City, Country"

### Technical Flow
```
User types → 300ms debounce → API call → Transform results → Show dropdown
```

## API Integration

### Location Search Endpoint
**Route**: `GET /api/locations/search?keyword={search_term}`

**Parameters**:
- `keyword` (required): Minimum 2 characters
- Searches: Airport codes, airport names, city names

**Response Format**:
```json
{
  "data": [
    {
      "code": "EBL",
      "name": "Erbil International Airport",
      "city": "Erbil",
      "country": "Iraq",
      "displayText": "EBL - Erbil International Airport, Erbil, IQ"
    }
  ]
}
```

## State Management

### Autocomplete States
```typescript
// Dropdown visibility
const [showFromDropdown, setShowFromDropdown] = useState(false);
const [showToDropdown, setShowToDropdown] = useState(false);

// Search results
const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
const [toSuggestions, setToSuggestions] = useState<any[]>([]);

// Loading states
const [isLoadingFrom, setIsLoadingFrom] = useState(false);
const [isLoadingTo, setIsLoadingTo] = useState(false);
```

## Debounce Logic

### Why 300ms?
- **Too Short (< 200ms)**: Excessive API calls, poor performance
- **300ms (Sweet Spot)**: Balance between responsiveness and efficiency
- **Too Long (> 500ms)**: Feels sluggish to users

### Implementation
```typescript
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    if (fromLocation && !fromLocation.includes(' - ')) {
      searchLocations(fromLocation, 'from');
    }
    if (toLocation && !toLocation.includes(' - ')) {
      searchLocations(toLocation, 'to');
    }
  }, 300);

  return () => clearTimeout(debounceTimer);
}, [fromLocation, toLocation]);
```

**Key Points**:
- Only searches if input doesn't contain " - " (not already formatted)
- Cleanup function clears previous timer on each keystroke
- Prevents search if less than 2 characters

## UI Components

### Input Field Features
```tsx
<input
  type="text"
  value={fromLocation}
  onChange={(e) => setFromLocation(e.target.value)}
  onFocus={() => fromSuggestions.length > 0 && setShowFromDropdown(true)}
  onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
  placeholder="Enter city or airport"
/>
```

**Event Handlers**:
- `onChange`: Updates state and triggers debounced search
- `onFocus`: Shows dropdown if suggestions exist
- `onBlur`: Delays hiding dropdown by 200ms (allows click to register)

### Loading Indicator
```tsx
{isLoadingFrom && (
  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
  </div>
)}
```

### Dropdown Suggestions
```tsx
<div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
  {fromSuggestions.map((location, index) => (
    <button
      key={index}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevents input blur
        setFromLocation(location.displayText);
        setShowFromDropdown(false);
      }}
      className="w-full px-4 py-3 text-left hover:bg-blue-50"
    >
      {/* Location display */}
    </button>
  ))}
</div>
```

**Important**: Uses `onMouseDown` instead of `onClick` to prevent blur event from hiding dropdown before click registers.

## Search Query Examples

### Common Searches
- **"istan"** → Istanbul (IST), Islamabad (ISB)
- **"lon"** → London Heathrow (LHR), London Gatwick (LGW)
- **"dub"** → Dubai (DXB), Dublin (DUB)
- **"par"** → Paris CDG (CDG), Paris Orly (ORY)

### Airport Codes
- **"EBL"** → Erbil International Airport
- **"IST"** → Istanbul Airport
- **"DXB"** → Dubai International Airport

### City Names
- **"Erbil"** → All airports in Erbil
- **"New York"** → JFK, LGA, EWR

## Performance Optimization

### 1. **Debouncing**
Reduces API calls from ~10 per search to 1-2

### 2. **Minimum Length Check**
```typescript
if (keyword.length < 2) {
  // Clear suggestions and hide dropdown
  return;
}
```

### 3. **Conditional Searches**
Only search when input is not already formatted:
```typescript
if (fromLocation && !fromLocation.includes(' - '))
```

### 4. **Amadeus Service Token Caching**
OAuth2 tokens are reused until 5 minutes before expiry

## Error Handling

### API Failures
```typescript
try {
  const response = await fetch(`/api/locations/search?keyword=...`);
  const data = await response.json();
  if (response.ok) {
    // Update suggestions
  }
} catch (error) {
  console.error('Location search error:', error);
  // Fail silently - don't disrupt user experience
}
```

**Strategy**: Silent failures allow users to continue typing manually if API unavailable

## Accessibility Features

### Keyboard Navigation (Future Enhancement)
- ↓ Arrow Down: Next suggestion
- ↑ Arrow Up: Previous suggestion
- Enter: Select highlighted suggestion
- Escape: Close dropdown

### Screen Reader Support (Future Enhancement)
- ARIA labels for inputs
- ARIA live regions for suggestion announcements
- Role="combobox" for autocomplete

## Testing Checklist

### Manual Testing
- [ ] Search with 1 character (no results)
- [ ] Search with 2+ characters (shows suggestions)
- [ ] Loading indicator appears during search
- [ ] Click suggestion populates input correctly
- [ ] Dropdown closes after selection
- [ ] Swap button maintains formatted locations
- [ ] Recent searches work with selected locations
- [ ] Flight search extracts correct airport codes

### API Testing
- [ ] Valid airport codes return results
- [ ] Invalid searches return empty array
- [ ] API errors don't break UI
- [ ] Debouncing prevents excessive calls

### Edge Cases
- [ ] Rapid typing
- [ ] Very long search terms
- [ ] Special characters
- [ ] Empty/whitespace input
- [ ] Network timeout

## Configuration

### Environment Variables
```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
AMADEUS_API_ENDPOINT=https://test.api.amadeus.com
```

### Adjustable Parameters
```typescript
// Debounce delay (ms)
const DEBOUNCE_DELAY = 300;

// Minimum search length
const MIN_SEARCH_LENGTH = 2;

// Blur delay (ms)
const BLUR_DELAY = 200;

// Max dropdown height
const MAX_DROPDOWN_HEIGHT = '15rem'; // 60 = 15rem
```

## Future Enhancements

### 1. **Popular Destinations**
Show frequently searched airports when field is focused and empty

### 2. **Recent Locations**
Cache user's recent searches in localStorage

### 3. **Geolocation**
Detect user's location and suggest nearby airports

### 4. **Airline Hubs**
Prioritize results based on airline partnerships

### 5. **Multi-city Search**
Support complex itineraries with multiple stops

### 6. **Keyboard Navigation**
Full arrow key support for dropdown selection

### 7. **Fuzzy Matching**
Handle typos better (e.g., "Dubia" → "Dubai")

## Troubleshooting

### Dropdown Not Showing
- **Check**: `fromSuggestions` or `toSuggestions` has data
- **Check**: `showFromDropdown` or `showToDropdown` is true
- **Check**: CSS z-index is high enough (z-50)

### API Not Called
- **Check**: Input has 2+ characters
- **Check**: Input doesn't contain " - " already
- **Check**: Environment variables are set
- **Check**: Debounce timer is working

### Selection Not Working
- **Check**: Using `onMouseDown` not `onClick`
- **Check**: `e.preventDefault()` is called
- **Check**: Blur delay (200ms) allows click to register

### Loading Indicator Stuck
- **Check**: `finally` block resets loading state
- **Check**: API call completes (no hanging promises)

## Related Files
- `frontend/src/app/dashboard/page.tsx` - Main component with autocomplete
- `frontend/src/app/api/locations/search/route.ts` - Location search API route
- `frontend/src/lib/amadeusService.ts` - Amadeus API service with searchLocations()
- `frontend/.env.local` - API credentials configuration

## Summary
The location autocomplete feature provides a professional, fast, and intuitive way for users to search for airports and cities. It uses Amadeus API for accurate results, implements debouncing for performance, and follows React best practices for state management and user interaction.
