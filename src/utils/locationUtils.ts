// Location utilities for GPS camera functionality
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
  nearbyLandmarks?: string[];
  timestamp: number;
}

declare global {
  interface Window {
    google: any;
  }
}

export class LocationService {
  private static instance: LocationService;
  
  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get current position with high accuracy
   */
  public async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000 // 30 seconds cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          let errorMessage = 'Unknown geolocation error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Reverse geocode coordinates to get detailed address information
   */
  public async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const latlng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const result = results[0];
          
          // Extract address components
          let address = '';
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';

          result.address_components.forEach((component: any) => {
            const types = component.types;
            
            if (types.includes('street_number')) {
              address = component.long_name + ' ';
            } else if (types.includes('route')) {
              address += component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          const locationData: LocationData = {
            latitude: lat,
            longitude: lng,
            accuracy: 0, // Will be set by caller
            address: address.trim(),
            city,
            state,
            country,
            postalCode,
            formattedAddress: result.formatted_address,
            timestamp: Date.now()
          };

          resolve(locationData);
        } else {
          reject(new Error('Geocoding failed: ' + status));
        }
      });
    });
  }

  /**
   * Wait for Google Maps API to be fully loaded
   */
  private async waitForGoogleMapsAPI(): Promise<boolean> {
    return new Promise((resolve) => {
      // If already loaded, resolve immediately
      if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService) {
        resolve(true);
        return;
      }

      // Wait up to 10 seconds for the API to load
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds at 100ms intervals
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.warn('Google Maps API failed to load within timeout');
          resolve(false);
        }
      }, 100);
    });
  }

  /**
   * Find nearby landmarks and points of interest
   */
  public async findNearbyLandmarks(lat: number, lng: number, radius: number = 500): Promise<string[]> {
    try {
      // Wait for Google Maps API to be fully loaded
      const apiReady = await this.waitForGoogleMapsAPI();
      if (!apiReady) {
        console.warn('Google Maps Places API not available');
        return [];
      }

      return new Promise((resolve) => {
        try {
          // Create a temporary map element for Places service
          const mapDiv = document.createElement('div');
          mapDiv.style.display = 'none';
          mapDiv.style.position = 'absolute';
          mapDiv.style.top = '-9999px';
          mapDiv.style.left = '-9999px';
          mapDiv.style.width = '1px';
          mapDiv.style.height = '1px';
          document.body.appendChild(mapDiv);
          
          // Create map with proper error handling
          const map = new window.google.maps.Map(mapDiv, {
            center: { lat, lng },
            zoom: 15
          });
          
          // Wait for map to be initialized
          window.google.maps.event.addListenerOnce(map, 'idle', () => {
            try {
              const service = new window.google.maps.places.PlacesService(map);
              
              const request = {
                location: new window.google.maps.LatLng(lat, lng),
                radius: radius,
                type: ['point_of_interest', 'establishment']
              };

              service.nearbySearch(request, (results: any[], status: string) => {
                try {
                  // Clean up the temporary map element
                  if (document.body.contains(mapDiv)) {
                    document.body.removeChild(mapDiv);
                  }
                  
                  if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                    const landmarks = results
                      .slice(0, 3) // Get top 3 landmarks
                      .map(place => place.name)
                      .filter(name => name && name.length > 0);
                    resolve(landmarks);
                  } else {
                    console.warn('Places API request failed with status:', status);
                    resolve([]);
                  }
                } catch (callbackError) {
                  console.warn('Error in Places API callback:', callbackError);
                  // Clean up on error
                  if (document.body.contains(mapDiv)) {
                    document.body.removeChild(mapDiv);
                  }
                  resolve([]);
                }
              });
            } catch (serviceError) {
              console.warn('Error creating Places service:', serviceError);
              // Clean up on error
              if (document.body.contains(mapDiv)) {
                document.body.removeChild(mapDiv);
              }
              resolve([]);
            }
          });
          
          // Fallback timeout in case map never becomes idle
          setTimeout(() => {
            if (document.body.contains(mapDiv)) {
              document.body.removeChild(mapDiv);
            }
            resolve([]);
          }, 5000);
          
        } catch (error) {
          console.warn('Error in findNearbyLandmarks:', error);
          resolve([]);
        }
      });
    } catch (error) {
      console.warn('Error in findNearbyLandmarks:', error);
      return [];
    }
  }

  /**
   * Get complete location data with address and landmarks
   */
  public async getCompleteLocationData(): Promise<LocationData> {
    try {
      // Get current position
      const position = await this.getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;

      // Get address information
      const locationData = await this.reverseGeocode(latitude, longitude);
      locationData.accuracy = accuracy;

      // Get nearby landmarks (with comprehensive error handling)
      try {
        const landmarks = await this.findNearbyLandmarks(latitude, longitude);
        locationData.nearbyLandmarks = landmarks;
      } catch (error) {
        console.warn('Could not fetch landmarks:', error);
        locationData.nearbyLandmarks = [];
      }

      return locationData;
    } catch (error) {
      console.error('Error getting complete location data:', error);
      throw error;
    }
  }

  /**
   * Format location data for display
   */
  public formatLocationDisplay(locationData: LocationData): string {
    const parts = [];
    
    if (locationData.address) {
      parts.push(locationData.address);
    }
    
    if (locationData.city) {
      parts.push(locationData.city);
    }
    
    if (locationData.state) {
      parts.push(locationData.state);
    }

    let display = parts.join(', ');
    
    if (locationData.nearbyLandmarks && locationData.nearbyLandmarks.length > 0) {
      display += ` (Near: ${locationData.nearbyLandmarks.join(', ')})`;
    }

    return display || `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
  }

  /**
   * Format coordinates for display
   */
  public formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  /**
   * Calculate accuracy description
   */
  public getAccuracyDescription(accuracy: number): string {
    if (accuracy <= 5) return 'Very High (±5m)';
    if (accuracy <= 10) return 'High (±10m)';
    if (accuracy <= 20) return 'Good (±20m)';
    if (accuracy <= 50) return 'Fair (±50m)';
    return `Low (±${Math.round(accuracy)}m)`;
  }
}

export default LocationService;