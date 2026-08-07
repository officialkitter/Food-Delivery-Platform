/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core App Shell Global Context Modal Controller Overlay
 * src/shell/GlobalModalSheet.js
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { height: DEVICE_HEIGHT } = Dimensions.get('window');

export const GlobalModalSheet = ({ visible = false, onClose, title, children }) => {
  const { colors, radius, spacing } = useTheme();
  const slideAnim = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 200,
        friction: 15,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: DEVICE_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.fullscreenBackdropContainer}>
        {/* Ambient Dark Mask Overlay Blur dismissal link */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[styles.dimmerBackdrop, { backgroundColor: colors.overlay }]} />
        </TouchableWithoutFeedback>

        <Animated.View 
          style={[
            styles.sheetSurfacePanel, 
            { 
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Aesthetic Drag Alignment Notch Anchor */}
          <View style={styles.dragAnchorRow}>
            <View style={[styles.dragNotchBar, { backgroundColor: colors.border }]} />
          </View>

          {title && (
            <View style={[styles.headerBlock, { paddingHorizontal: spacing.md }]}>
              <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
            </View>
          )}

          <View style={[styles.childrenContentContainer, { padding: spacing.md }]}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullscreenBackdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dimmerBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetSurfacePanel: {
    width: '100%',
    maxHeight: DEVICE_HEIGHT * 0.85,
    minHeight: 200,
  },
  dragAnchorRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragNotchBar: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  headerBlock: {
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  childrenContentContainer: {
    flex: 1,
  },
});
