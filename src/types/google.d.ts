declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          types?: string[];
        },
        callback: (predictions: Prediction[], status: PlacesServiceStatus) => void
      ): void;
    }

    class PlacesService {
      constructor(div: HTMLElement);
      getDetails(
        request: {
          placeId: string;
          fields: string[];
        },
        callback: (result: any, status: PlacesServiceStatus) => void
      ): void;
    }

    interface Prediction {
      description: string;
      place_id: string;
      structured_formatting?: {
        main_text: string;
        secondary_text: string;
      };
    }

    enum PlacesServiceStatus {
      OK = 'OK',
      ERROR = 'ERROR',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      ZERO_RESULTS = 'ZERO_RESULTS',
      NOT_FOUND = 'NOT_FOUND'
    }
  }
} 