/**
 * Buza Food Delivery Mobile Application
 * Core Market Stack State Navigation Controller
 * src/screens/market/MarketNavigator.js
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

// Import all 11 modules located within your market filesystem directory
import CartScreen from '../../screens/market/cart';
import DiscoveryScreen from '../../screens/market/discovery';
import FavoriteScreen from '../../screens/market/favorite';
import HomeScreen from '../../screens/market/home';
import NearbyMapScreen from '../../screens/market/nearbymap';
import NearbyVendorsScreen from '../../screens/market/nearbyvendors';
import ProductScreen from '../../screens/market/product';
import ProductDetailScreen from '../../screens/market/productdetail';
import ServicesScreen from '../../screens/market/services';
import VendorCatalogScreen from '../../screens/market/vendorcatalog';
import VendorStatusScreen from '../../screens/market/vendorstatus';
import { ComingSoon } from '../../screens/auth/comingsoon';
import { PremiumMotionBackdrop } from '../../components/common/PremiumMotionBackdrop';
import { cartService } from '../../services/cartService';

const TAB_TO_SCREEN = {
  home: 'HOME',
  fudcamp: 'FUDCAMP',
  service: 'SERVICES',
  favorite: 'FAVORITE',
  nearby: 'NEARBY_MAP',
  orders: 'CART',
  account: 'ACCOUNT',
};

const SCREEN_TO_TAB = {
  HOME: 'home',
  DISCOVERY: 'home',
  PRODUCT: 'home',
  PRODUCT_DETAIL: 'home',
  VENDOR_CATALOG: 'home',
  VENDOR_STATUS: 'home',
  NEARBY_VENDORS: 'nearby',
  NEARBY_MAP: 'nearby',
  SERVICES: 'service',
  FAVORITE: 'favorite',
  CART: 'orders',
  FUDCAMP: 'fudcamp',
  ACCOUNT: 'account',
};

const TAB_BAR_VISIBLE_SCREENS = new Set([
  'HOME',
  'DISCOVERY',
  'FAVORITE',
  'SERVICES',
  'NEARBY_MAP',
  'NEARBY_VENDORS',
  'CART',
  'FUDCAMP',
  'ACCOUNT',
]);

const shouldShowBottomTabs = (screenName) => TAB_BAR_VISIBLE_SCREENS.has(screenName);

export default function MarketNavigator({
  onAppMarketFlowComplete,
  activeTab,
  onActiveTabChange,
  onShellTabsVisibilityChange,
}) {
  // Centralized state tracks which active screen name layer is visible
  const [currentScreen, setCurrentScreen] = useState('HOME');

  // Shared payload storage context to hold basket data, selected vendors, or custom choices across screens
  const marketPayloadRef = useRef({
    basket: [],
    selectedVendor: null,
    selectedDish: null,
    chosenExtras: []
  });

  const setMarketPayload = (valueOrUpdater) => {
    marketPayloadRef.current = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(marketPayloadRef.current)
      : valueOrUpdater;
  };

  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
    const mappedTab = SCREEN_TO_TAB[screenName];
    if (mappedTab && onActiveTabChange && mappedTab !== activeTab) {
      onActiveTabChange(mappedTab);
    }
  };

  useEffect(() => {
    const targetScreen = TAB_TO_SCREEN[activeTab];
    if (targetScreen && targetScreen !== currentScreen) {
      setCurrentScreen(targetScreen);
    }
  }, [activeTab]);

  useEffect(() => {
    if (onShellTabsVisibilityChange) {
      onShellTabsVisibilityChange(shouldShowBottomTabs(currentScreen));
    }
  }, [currentScreen, onShellTabsVisibilityChange]);

  return (
    <View style={styles.container}>
      {/* 1. HOME SCREEN SECTION */}
      {currentScreen === 'HOME' && (
        <HomeScreen 
          onSelectRestaurant={(vendor) => {
            setMarketPayload(prev => ({ ...prev, selectedVendor: vendor }));
            handleScreenChange('VENDOR_CATALOG');
          }}
          onSelectCategory={(category) => {
            setMarketPayload(prev => ({ ...prev, currentCategory: category }));
            handleScreenChange('DISCOVERY');
          }}
          onNotificationPress={() => handleScreenChange('NEARBY_VENDORS')}
        />
      )}

      {/* 2. DISCOVERY MARKETPLACE SCREEN */}
      {currentScreen === 'DISCOVERY' && (
        <DiscoveryScreen 
          onSelectDish={(dish) => {
            setMarketPayload(prev => ({ ...prev, selectedDish: dish }));
            handleScreenChange('PRODUCT_DETAIL');
          }}
          onFilterPress={() => handleScreenChange('NEARBY_MAP')}
        />
      )}

      {/* 3. FAVORITES MANAGEMENT SCREEN */}
      {currentScreen === 'FAVORITE' && (
        <FavoriteScreen 
          onSelectFavorite={(dish) => {
            setMarketPayload(prev => ({ ...prev, selectedDish: dish }));
            handleScreenChange('PRODUCT');
          }}
          onDiscoverFood={() => handleScreenChange('DISCOVERY')}
        />
      )}

      {/* 4. CHOSEN PRODUCT ROOT VARIANT SCREEN */}
      {currentScreen === 'PRODUCT' && (
        <ProductScreen 
          routeItem={marketPayloadRef.current.selectedDish}
          onAddToBasket={(itemData) => {
            setMarketPayload(prev => ({ ...prev, basket: [...prev.basket, itemData] }));
            handleScreenChange('SERVICES');
          }}
          onBackPress={() => handleScreenChange('HOME')}
        />
      )}
      {/* 5. ALTERNATIVE PRODUCT DETAILS MODAL TARGET SCREEN */}
      {currentScreen === 'PRODUCT_DETAIL' && (
        <ProductDetailScreen 
          routeItem={marketPayloadRef.current.selectedDish}
          onAddToBasket={(itemData) => {
            setMarketPayload(prev => ({ ...prev, basket: [...prev.basket, itemData] }));
            handleScreenChange('CART');
          }}
          onBackPress={() => handleScreenChange('DISCOVERY')}
        />
      )}

      {/* 6. REAL-TIME NEARBY MAP SCANNING SCREEN */}
      {currentScreen === 'NEARBY_MAP' && (
        <NearbyMapScreen 
          onSelectKitchen={(vendor) => {
            setMarketPayload(prev => ({ ...prev, selectedVendor: vendor }));
            handleScreenChange('VENDOR_STATUS');
          }}
          onBackPress={() => handleScreenChange('DISCOVERY')}
        />
      )}

      {/* 7. OPEN KITCHENS AND VENDORS LIST SCREEN */}
      {currentScreen === 'NEARBY_VENDORS' && (
        <NearbyVendorsScreen 
          onSelectVendor={(vendor) => {
            setMarketPayload(prev => ({ ...prev, selectedVendor: vendor }));
            handleScreenChange('VENDOR_CATALOG');
          }}
          onBackPress={() => handleScreenChange('HOME')}
        />
      )}

      {/* 8. OPTIONAL SERVICES AND EXTRA MEAL ADD-ONS SCREEN */}
      {currentScreen === 'SERVICES' && (
        <ServicesScreen 
          onSaveServices={(extrasData) => {
            setMarketPayload(prev => ({ ...prev, chosenExtras: extrasData }));
            handleScreenChange('CART');
          }}
          onBackPress={() => handleScreenChange('PRODUCT')}
        />
      )}

      {/* 9. RESTAURANT MENU CATALOG BROWSING SCREEN */}
      {currentScreen === 'VENDOR_CATALOG' && (
        <VendorCatalogScreen 
          routeVendor={marketPayloadRef.current.selectedVendor}
          onSelectDish={(dish) => {
            setMarketPayload(prev => ({ ...prev, selectedDish: dish }));
            handleScreenChange('PRODUCT_DETAIL');
          }}
          onBackPress={() => handleScreenChange('HOME')}
        />
      )}

      {/* 10. REAL-TIME KITCHEN STATUS & METRICS SCREEN */}
      {currentScreen === 'VENDOR_STATUS' && (
        <VendorStatusScreen 
          routeVendor={marketPayloadRef.current.selectedVendor}
          onRefreshStatus={() => handleScreenChange('VENDOR_CATALOG')}
          onBackPress={() => handleScreenChange('NEARBY_MAP')}
        />
      )}

      {/* 11. PREMIUM INTEGRATED SHOPPING CART VIEW SCREEN */}
      {currentScreen === 'CART' && (
        <CartScreen 
          onCheckoutProceed={async (cartPayload) => {
            const subtotal = Array.isArray(cartPayload?.items)
              ? cartPayload.items.reduce((sum, item) => sum + ((Number(item?.price) || 0) * (Number(item?.quantity) || 1)), 0)
              : 0;
            const total = Number(cartPayload?.total) || subtotal;

            const response = await cartService.dispatchCartOrder({
              items: cartPayload?.items || [],
              subtotal,
              deliveryFee: Math.max(total - subtotal, 0),
              total,
              paymentMethod: 'pending',
            });

            if (response?.success === false) {
              throw new Error(response?.error || 'Checkout failed.');
            }

            Alert.alert('Order Submitted', 'Order has been submitted to Supabase successfully.');

            if (onAppMarketFlowComplete) {
              onAppMarketFlowComplete(response?.data?.order || cartPayload);
            }
          }}
          onContinueShopping={() => handleScreenChange('HOME')}
        />
      )}

      {currentScreen === 'FUDCAMP' && <ComingSoon />}

      {currentScreen === 'ACCOUNT' && <ComingSoon />}

      <View style={styles.motionBackdropLayer} pointerEvents="none">
        <PremiumMotionBackdrop />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  motionBackdropLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 20,
  },
});
