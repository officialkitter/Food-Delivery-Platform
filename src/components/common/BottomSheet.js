import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheet = ({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.5
}) => {
  const { colors, radius } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.rootContainer}>
        {/* Animated Background Overlay Blur tint */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[styles.backdrop, { backgroundColor: colors.overlay }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surface,
              height: height,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.indicatorAnchor}>
            <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.innerContent}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  indicatorAnchor: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
  },
  innerContent: {
    flex: 1,
  },
});
