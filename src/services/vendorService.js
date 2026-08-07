/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Marketplace Operations & Restaurant Discovery Service
 * src/services/vendorService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

export const vendorService = {
  /**
   * Fetches lists of nearby restaurants matching the user's geolocation bounds
   */
  async discoverNearbyVendors(latitude, longitude, activeSearchKeyword = '') {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const mockList = [
        { id: 'vnd_1', name: 'Le Table Gourmet', rating: 4.9, tags: ['Burgers', 'Premium'], deliveryFee: 'Free' },
        { id: 'vnd_2', name: 'Artisan Pasta Grill', rating: 4.7, tags: ['Italian', 'Artisan'], deliveryFee: '$1.99' }
      ];
      return activeSearchKeyword 
        ? mockList.filter(v => v.name.toLowerCase().includes(activeSearchKeyword.toLowerCase()))
        : mockList;
    }
    const queryPath = `${ApiEndpoints.vendor.browse}?lat=${latitude}&lng=${longitude}&search=${encodeURIComponent(activeSearchKeyword)}`;
    return await apiclient.get(queryPath);
  },

  /**
   * Pulls the full multi-tier categorized food and drink catalog of a single restaurant
   */
  async retrieveRestaurantMenuCatalog(restaurantId) {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: restaurantId,
        categories: [
          {
            id: 'c_signature',
            name: 'Chef Specials',
            items: [{ id: 'p_wagyu', title: 'Umai Wagyu Smash', price: 19.50, description: 'Double wagyu smashed blend with gold sauce.' }]
          }
        ]
      };
    }
    return await apiclient.get(ApiEndpoints.vendor.details(restaurantId));
  }
};
