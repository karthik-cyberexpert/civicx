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
   * Get current position with device GPS (not network-based location)
   */
  public async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      console.log('🛰️ Requesting device GPS location (forcing satellite positioning)...');
      
      // Try to get pure GPS first with watch position for better satellite lock
      this.getDeviceGPSPosition(resolve, reject);
    });
  }

  /**
   * Get device GPS position using watch method for better satellite acquisition
   */
  private getDeviceGPSPosition(
    resolve: (position: GeolocationPosition) => void,
    reject: (error: Error) => void
  ): void {
    let bestPosition: GeolocationPosition | null = null;
    let gpsAttempts = 0;
    const maxGpsAttempts = 30;
    let gpsWatchId: number | null = null;
    let fallbackTimeoutId: NodeJS.Timeout | null = null;
    
    // Ultra high accuracy options to force GPS satellite usage
    const gpsOptions: PositionOptions = {
      enableHighAccuracy: true, // Force GPS receiver usage
      timeout: 15000, // 15 seconds per attempt
      maximumAge: 0 // No cached data - fresh GPS reading only
    };

    console.log('🔄 Starting GPS satellite acquisition...');
    
    const cleanup = () => {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;
      }
      if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
        fallbackTimeoutId = null;
      }
    };

    // Watch position for continuous GPS updates
    gpsWatchId = navigator.geolocation.watchPosition(
      (position) => {
        gpsAttempts++;
        const accuracy = position.coords.accuracy;
        const isGPSBased = accuracy <= 65; // GPS typically gives ≤65m accuracy
        
        console.log(`📡 GPS reading ${gpsAttempts}:`, {
          accuracy: `${accuracy.toFixed(1)}m`,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          source: isGPSBased ? '🛰️ GPS Satellite' : '📶 Network/Cell'
        });
        
        // Update best position if this is more accurate
        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
          console.log(`🎯 New best GPS fix: ${accuracy.toFixed(1)}m accuracy`);
        }
        
        // Success conditions:
        // 1. Very high accuracy (likely pure GPS)
        // 2. Good accuracy after several attempts
        // 3. Maximum attempts reached
        const isVeryAccurate = accuracy <= 10;
        const isGoodAfterAttempts = accuracy <= 30 && gpsAttempts >= 5;
        const maxAttemptsReached = gpsAttempts >= maxGpsAttempts;
        
        if (isVeryAccurate || isGoodAfterAttempts || maxAttemptsReached) {
          cleanup();
          const finalAccuracy = bestPosition!.coords.accuracy;
          const source = finalAccuracy <= 65 ? 'GPS Satellite' : 'Network/Hybrid';
          
          console.log(`✅ GPS acquisition complete: ${finalAccuracy.toFixed(1)}m (${source})`);
          console.log('📍 Final GPS coordinates:', {
            lat: bestPosition!.coords.latitude,
            lng: bestPosition!.coords.longitude,
            accuracy: finalAccuracy,
            timestamp: new Date(bestPosition!.timestamp).toISOString()
          });
          
          resolve(bestPosition!);
        }
      },
      (error) => {
        cleanup();
        let errorMessage = 'GPS acquisition failed';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS access denied. Please enable location permissions in your browser and device settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS signal unavailable. Please ensure:\n• Device GPS is enabled\n• You are outdoors or near a window\n• Location services are enabled';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS timeout. For better GPS signal:\n• Move to an open area\n• Ensure clear view of the sky\n• Wait a moment for GPS to initialize';
            break;
        }
        
        console.error('❌ GPS Error:', errorMessage);
        
        // If we have a fallback position, use it
        if (bestPosition) {
          console.log('🔄 Using best available GPS position as fallback');
          resolve(bestPosition);
        } else {
          reject(new Error(errorMessage));
        }
      },
      gpsOptions
    );

    // Fallback timeout - ensure we don't wait forever
    fallbackTimeoutId = setTimeout(() => {
      cleanup();
      
      if (bestPosition) {
        const finalAccuracy = bestPosition.coords.accuracy;
        console.log(`⏰ GPS timeout reached, using best position: ${finalAccuracy.toFixed(1)}m`);
        resolve(bestPosition);
      } else {
        console.error('⏰ GPS timeout with no position acquired');
        reject(new Error('GPS timeout: Unable to acquire GPS signal. Please ensure GPS is enabled and try in an open area.'));
      }
    }, 60000); // 1 minute total timeout
  }


  /**
   * Reverse geocode coordinates to get detailed address information like GPS cameras
   * Optimized for accurate results in Indian locations like Kothur, Hosur
   */
  public async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const latlng = new window.google.maps.LatLng(lat, lng);

      console.log(`🗺️ Starting reverse geocoding for coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);

      // Enhanced geocoding request for Indian locations
      geocoder.geocode({ 
        location: latlng,
        language: 'en', // English for consistency
        region: 'IN', // India region code for local preference
        // Use multiple result types to get comprehensive data
        result_type: [
          'street_address',
          'premise', 
          'subpremise',
          'route',
          'sublocality_level_1',
          'sublocality_level_2', 
          'sublocality',
          'locality',
          'administrative_area_level_2',
          'administrative_area_level_1',
          'postal_code'
        ]
      }, (results: any[], status: string) => {
        if (status === 'OK' && results && results.length > 0) {
          console.log(`📍 Found ${results.length} geocoding results:`);
          results.forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.formatted_address} (${result.types.join(', ')})`);
          });
          
          // Smart result selection for Indian addressing system
          let bestResult = results[0]; // Default to first result
          
          // Prioritize results with specific locality information
          for (const result of results) {
            const types = result.types;
            
            // Prefer street address with sublocality (common in Indian addressing)
            if (types.includes('street_address') && 
                result.address_components.some((comp: any) => 
                  comp.types.includes('sublocality_level_1') || 
                  comp.types.includes('sublocality')
                )) {
              bestResult = result;
              console.log('🎯 Selected street address with sublocality');
              break;
            }
            
            // Next preference: premise with good locality info
            if (types.includes('premise') &&
                result.address_components.some((comp: any) => 
                  comp.types.includes('locality')
                )) {
              bestResult = result;
              console.log('🎯 Selected premise with locality');
              // Continue searching for street address
            }
            
            // Backup: any result with sublocality
            if (!bestResult.address_components.some((comp: any) => 
                  comp.types.includes('sublocality_level_1')
                ) && 
                result.address_components.some((comp: any) => 
                  comp.types.includes('sublocality_level_1') ||
                  comp.types.includes('sublocality')
                )) {
              bestResult = result;
            }
          }
          
          console.log('🎯 Best result selected:', bestResult.formatted_address);
          
          // Extract detailed address components for GPS camera-style display
          let streetNumber = '';
          let route = '';
          let sublocality = '';
          let sublocalityLevel1 = '';
          let locality = '';
          let administrativeAreaLevel2 = '';
          let administrativeAreaLevel1 = '';
          let country = '';
          let postalCode = '';
          let premise = '';
          let subpremise = '';

          bestResult.address_components.forEach((component: any) => {
            const types = component.types;
            const longName = component.long_name;
            
            console.log(`🏷️ Component: ${longName} (${types.join(', ')})`);
            
            if (types.includes('street_number')) {
              streetNumber = longName;
            } else if (types.includes('route')) {
              route = longName;
            } else if (types.includes('premise')) {
              premise = longName;
            } else if (types.includes('subpremise')) {
              subpremise = longName;
            } else if (types.includes('sublocality_level_1')) {
              sublocalityLevel1 = longName;
            } else if (types.includes('sublocality')) {
              sublocality = longName;
            } else if (types.includes('locality')) {
              locality = longName;
            } else if (types.includes('administrative_area_level_2')) {
              administrativeAreaLevel2 = longName;
            } else if (types.includes('administrative_area_level_1')) {
              administrativeAreaLevel1 = longName;
            } else if (types.includes('country')) {
              country = longName;
            } else if (types.includes('postal_code')) {
              postalCode = longName;
            }
          });

          // Build detailed address like professional GPS cameras
          let address = '';
          
          // Start with most specific location identifier
          if (premise) {
            address += premise;
            if (subpremise) address += `-${subpremise}`;
            address += ' ';
          }
          
          // Add street number and name
          if (streetNumber && route) {
            address += `${streetNumber} ${route}`;
          } else if (route) {
            address += route;
          }
          
          // Clean up address
          address = address.trim();
          
          // Determine the most specific city/area name - prioritize sublocality for Indian addresses
          let city = '';
          if (sublocalityLevel1) {
            city = sublocalityLevel1;
            // Add parent locality if different and specific
            if (locality && locality !== sublocalityLevel1 && 
                !sublocalityLevel1.includes(locality) && 
                !locality.includes(sublocalityLevel1)) {
              city += `, ${locality}`;
            }
          } else if (sublocality) {
            city = sublocality;
            if (locality && locality !== sublocality) {
              city += `, ${locality}`;
            }
          } else if (locality) {
            city = locality;
          } else if (administrativeAreaLevel2) {
            city = administrativeAreaLevel2;
          }
          
          // State
          let state = administrativeAreaLevel1 || '';
          
          console.log('📍 Parsed location components:', {
            premise,
            streetNumber,
            route, 
            address,
            sublocalityLevel1,
            sublocality,
            locality,
            city,
            state,
            country,
            postalCode
          });

          const locationData: LocationData = {
            latitude: lat,
            longitude: lng,
            accuracy: 0, // Will be set by caller
            address: address || undefined,
            city: city || undefined,
            state: state || undefined,
            country: country || undefined,
            postalCode: postalCode || undefined,
            formattedAddress: bestResult.formatted_address,
            timestamp: Date.now()
          };

          console.log('✅ Final location data:', locationData);
          resolve(locationData);
        } else {
          console.error('❌ Geocoding failed:', status);
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
   * Format location data for GPS camera-style display
   */
  public formatLocationDisplay(locationData: LocationData): string {
    const parts = [];
    
    // Build address like GPS camera: Street, City, State, Country
    if (locationData.address) {
      parts.push(locationData.address);
    }
    
    if (locationData.city) {
      parts.push(locationData.city);
    }
    
    if (locationData.state) {
      parts.push(locationData.state);
    }

    if (locationData.country) {
      parts.push(locationData.country);
    }

    let display = parts.join(', ');
    
    if (locationData.nearbyLandmarks && locationData.nearbyLandmarks.length > 0) {
      display += ` (Near: ${locationData.nearbyLandmarks.join(', ')})`;
    }

    return display || `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
  }

  /**
   * Format coordinates with hemisphere indicators like GPS cameras
   */
  public formatCoordinates(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `Lat ${Math.abs(lat).toFixed(6)}°${latDir} Long ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  }

  /**
   * Format timestamp like GPS Map Camera
   */
  public formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    // Get timezone offset
    const timezoneOffset = date.getTimezoneOffset();
    const tzHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const tzMinutes = Math.abs(timezoneOffset) % 60;
    const tzSign = timezoneOffset <= 0 ? '+' : '-';
    const timezone = `GMT ${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm} ${timezone}`;
  }

  /**
   * Get detailed location information like GPS cameras
   */
  public getDetailedLocationInfo(locationData: LocationData): {
    address: string;
    coordinates: string;
    timestamp: string;
    accuracy: string;
    quality: string;
  } {
    return {
      address: this.formatLocationDisplay(locationData),
      coordinates: this.formatCoordinates(locationData.latitude, locationData.longitude),
      timestamp: this.formatTimestamp(locationData.timestamp),
      accuracy: this.getAccuracyDescription(locationData.accuracy),
      quality: this.getLocationQuality(locationData.accuracy).quality
    };
  }

  /**
   * Calculate accuracy description
   */
  public getAccuracyDescription(accuracy: number): string {
    if (accuracy <= 5) return 'Very High (±5m)';
    if (accuracy <= 10) return 'High (±10m)';
    if (accuracy <= 20) return 'Good (±20m)';
    if (accuracy <= 50) return 'Fair (±50m)';
    if (accuracy <= 100) return 'Moderate (±100m)';
    if (accuracy <= 500) return 'Low (±500m)';
    if (accuracy <= 1000) return 'Poor (±1km)';
    if (accuracy <= 10000) return 'Very Poor (±10km)';
    return 'Network-based (±' + Math.round(accuracy/1000) + 'km)';
  }

  /**
   * Get location quality assessment
   */
  public getLocationQuality(accuracy: number): { quality: string; description: string; recommendation: string } {
    if (accuracy <= 20) {
      return {
        quality: 'excellent',
        description: 'GPS-based location with high precision',
        recommendation: 'Perfect for precise location tagging'
      };
    } else if (accuracy <= 100) {
      return {
        quality: 'good',
        description: 'GPS-based location with good precision',
        recommendation: 'Suitable for most location tagging needs'
      };
    } else if (accuracy <= 1000) {
      return {
        quality: 'fair',
        description: 'Mixed GPS/Network location',
        recommendation: 'May need to move outdoors for better accuracy'
      };
    } else {
      return {
        quality: 'poor',
        description: 'Network-based location (WiFi/IP)',
        recommendation: 'Go outdoors and enable GPS for better accuracy'
      };
    }
  }
}

export default LocationService;