/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Geocoding & Spatial Location Hardware Sensor Mapping Service
 * src/services/locationService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

const pickPayload = (response) => response?.data ?? response;

export const locationService = {
  /**
   * Converts spatial latitude and longitude details into a readable physical address
   */
  async reverseGeocodeCoordinates(lat, lng) {
    const response = await apiclient.get(`${ApiEndpoints.maps.reverseGeocode}?latitude=${lat}&longitude=${lng}`);
    const payload = pickPayload(response);
    return {
      label: payload?.label || 'Current Location',
      street: payload?.street || '',
      city: payload?.city || '',
      country: payload?.country || '',
      formattedAddress: payload?.formattedAddress || '',
      coordinates: payload?.coordinates || { latitude: lat, longitude: lng },
    };
  },

  /**
   * Computes geographic route data to display delivery driver movements on a map
   */
  async acquireRouteTrackingMatrix(originCoordinates, driverCoordinates) {
    if (__DEV__) {
      return { polylineString: 'a_b_polyline_path', etaText: '11 mins', directDistanceKm: 3.4 };
    }
    return await apiclient.post('/maps/route-matrix', { origin: originCoordinates, driver: driverCoordinates });
  }
};
