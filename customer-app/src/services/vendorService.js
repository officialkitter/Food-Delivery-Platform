/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Marketplace Operations & Restaurant Discovery Service
 * src/services/vendorService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

const pickPayload = (response) => response?.data ?? response;

export const vendorService = {
  /**
   * Fetches lists of nearby restaurants matching the user's geolocation bounds
   */
  async discoverNearbyVendors(latitude, longitude, activeSearchKeyword = '') {
    const queryPath = `${ApiEndpoints.vendor.browse}?lat=${latitude}&lng=${longitude}&search=${encodeURIComponent(activeSearchKeyword)}`;
    const response = await apiclient.get(queryPath);
    return pickPayload(response);
  },

  /**
   * Pulls the full multi-tier categorized food and drink catalog of a single restaurant
   */
  async retrieveRestaurantMenuCatalog(restaurantId) {
    const response = await apiclient.get(ApiEndpoints.vendor.details(restaurantId));
    return pickPayload(response);
  },

  async fetchHomeMarketplaceFeed(activeSearchKeyword = '') {
    const queryPath = `${ApiEndpoints.vendor.homeFeed}?search=${encodeURIComponent(activeSearchKeyword)}`;
    const response = await apiclient.get(queryPath);
    const payload = pickPayload(response);

    return {
      currency: payload?.currency || 'TZS',
      vendors: Array.isArray(payload?.vendors) ? payload.vendors : [],
      products: Array.isArray(payload?.products) ? payload.products : [],
      categories: Array.isArray(payload?.categories) ? payload.categories : [],
    };
  },

  async seedMarketplaceData() {
    const response = await apiclient.post(ApiEndpoints.admin.seedMarketplace, {});
    return pickPayload(response);
  },
};
