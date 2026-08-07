/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Local Storage and Persistence Subsystem Data Interface
 * src/services/localStorage.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
  /**
   * Save a JSON object or primitive string to local disk storage
   */
  async setItem(storageKey, targetData) {
    try {
      const stringifiedValue = typeof targetData === 'string' ? targetData : JSON.stringify(targetData);
      await AsyncStorage.setItem(storageKey, stringifiedValue);
      return true;
    } catch (exception) {
      console.error(`[Buza LocalStorage Exception]: Failed to cache key [${storageKey}]`, exception);
      return false;
    }
  },

  /**
   * Fetch data from local disk storage with safe, built-in JSON parsing checks
   */
  async getItem(storageKey) {
    try {
      const cachedValue = await AsyncStorage.getItem(storageKey);
      if (!cachedValue) return null;
      try {
        return JSON.parse(cachedValue);
      } catch {
        return cachedValue;
      }
    } catch (exception) {
      console.error(`[Buza LocalStorage Exception]: Failed to read key [${storageKey}]`, exception);
      return null;
    }
  },

  /**
   * Encrypted persistent identity data slot placeholder
   * Note: Replace internal calls with expo-secure-store or react-native-keychain when exiting sandbox
   */
  async setSecureItem(storageKey, tokenPayload) {
    return await this.setItem(storageKey, tokenPayload);
  },

  async getSecureItem(storageKey) {
    return await this.getItem(storageKey);
  },

  /**
   * Flush individual key entries from memory immediately
   */
  async deleteItem(storageKey) {
    try {
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (exception) {
      console.error(`[Buza LocalStorage Exception]: Failed to delete key [${storageKey}]`, exception);
      return false;
    }
  },

  /**
   * Multi-key simultaneous drop framework used during global logouts
   */
  async multiDelete(storageKeysArray = []) {
    try {
      await AsyncStorage.multiRemove(storageKeysArray);
      return true;
    } catch (exception) {
      console.error(`[Buza LocalStorage Exception]: Failed to delete keys [${storageKeysArray.join(', ')}]`, exception);
      return false;
    }
  }
};
