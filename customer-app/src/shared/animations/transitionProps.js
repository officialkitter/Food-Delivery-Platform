/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Reusable High-Fidelity UI Interpolation Presets
 * src/core/animations/transitionProps.js
 */

import { Animations } from '../constants/theme';

const DEFAULT_INPUT_RANGE = [0, 1];

export const TransitionProps = {
  // Fluid layout configuration matrix matching premium Apple Human Interface standards
  springConfig: {
    tension: 180,
    friction: 12,
    useNativeDriver: true
  },
  
  // Custom interaction configurations mapping active scale shifts on touch feedback loops
  buttonPressScale: {
    inputRange: DEFAULT_INPUT_RANGE,
    outputRange: [Animations?.scale?.pressed || 0.96, Animations?.scale?.standard || 1.0]
  },

  // Slide configuration mapping bottom panel popups smoothly
  panelSlideUp: (animatedValueVector, layoutHeightValue) => ({
    transform: [{
      translateY: animatedValueVector.interpolate({
        inputRange: DEFAULT_INPUT_RANGE,
        outputRange: [layoutHeightValue, 0]
      })
    }]
  })
};
