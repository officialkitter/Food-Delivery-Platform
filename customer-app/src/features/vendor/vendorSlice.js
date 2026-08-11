/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Feature State Engine: Vendor Marketplace & Menu Slice
 * src/features/vendor/vendorSlice.js
 */

import { useState, useCallback } from 'react';

export const useVendorSlice = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeMenuCategories, setActiveMenuCategories] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Call simulation: Query marketplace cluster configurations filtered by live geocoding coordinates
  const fetchNearbyRestaurants = useCallback(async (coordinates, searchFilter = '') => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockData = [
        {
          id: 'vnd_101',
          name: 'Chefs Table Gourmet Burgers',
          rating: 4.9,
          deliveryTime: '20-30',
          deliveryFee: 'Free',
          tags: ['Burgers', 'Premium', 'American'],
          imageUrl: 'https://unsplash.com',
        },
        {
          id: 'vnd_102',
          name: 'Pizzeria Napoli & Artisan Drinks',
          rating: 4.7,
          deliveryTime: '15-25',
          deliveryFee: 'TZS 2,990',
          tags: ['Pizza', 'Italian', 'Vegetarian'],
          imageUrl: 'https://unsplash.com',
        }
      ];

      setRestaurants(
        searchFilter 
          ? mockData.filter((r) => r.name.toLowerCase().includes(searchFilter.toLowerCase()))
          : mockData
      );
    } catch (err) {
      setError('Marketplace registry stream failed to fetch records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // API Call simulation: Fetch hierarchical menu trees for deep-linked profiles
  const fetchRestaurantMenuProfile = useCallback(async (vendorId) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSelectedRestaurant({
        id: vendorId,
        name: 'Chefs Table Gourmet Burgers',
        coverImage: 'https://unsplash.com',
        rating: 4.9,
      });

      setActiveMenuCategories([
        {
          id: 'cat_m1',
          name: 'Signature Crafts',
          items: [
            { id: 'prd_w1', title: 'Truffle Umami Wagyu', price: 18.99, description: 'Aged Wagyu patty layered in local white truffle aioli.', imageUrl: '' },
            { id: 'prd_w2', title: 'Hot Honey Crispy Bird', price: 14.50, description: 'Buttermilk southern bird tossed in house hot organic habanero honey.', imageUrl: '' }
          ]
        },
        {
          id: 'cat_m2',
          name: 'Artisan Sides',
          items: [
            { id: 'prd_s1', title: 'Parmesan Truffle Shoestrings', price: 6.00, description: 'Hand-cut russet potatoes dusted in 24-month parmigiano-reggiano.', imageUrl: '' }
          ]
        }
      ]);
    } catch (err) {
      setError('Failed to download deep-linked merchant menu catalogs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    restaurants,
    activeMenuCategories,
    selectedRestaurant,
    isLoading,
    error,
    fetchNearbyRestaurants,
    fetchRestaurantMenuProfile,
  };
};
