/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Geocoding & Spatial Location Hardware Sensor Mapping Service
 * src/services/locationService.js
 */

import { apiclient } from './apiClient';

export const locationService = {
  /**
   * Converts spatial latitude and longitude details into a readable physical address
   */
  async reverseGeocodeCoordinates(lat, lng) {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { street: '92 Culinary Estate Way', complex: 'Tower B Suite 4', city: 'Dodoma' };
    }
    return await apiclient.get(`/maps/reverse-geocode?latitude=${lat}&longitude=${lng}`);
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
