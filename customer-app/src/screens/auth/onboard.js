/**
 * Buza Food Delivery Mobile Application
 * Onboarding Layout Component
 * src/screens/onboarding.js
 * 
 * Part 1: Imports, Color System, and Text Content
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const onboardingImages = [
  require('../../assets/images/1.png'),
  require('../../assets/images/2.png'),
  require('../../assets/images/3.png'),
  require('../../assets/images/4.png'),
  require('../../assets/images/5.png'),
];

// Professional application color settings
const ONBOARDING_COLORS = {
  primary: '#E65100',  // Main brand color
  orange: '#E65100',   // Warm layout accent
  gold: '#FFB300',     // Premium accent color
  olive: '#558B2F',    // Natural accent color
  charcoal: '#1E1E24', // Main heading color
  white: '#FFFFFF',    // Screen background color
  muted: '#64748B',    // Subtitle text color
};

// Application text data configuration
const onboardingScreensData = [
  {
    id: '1',
    title: 'Welcome to Buza App',
    subtitle: 'Where every meal begins with a story, every delivery brings a smile, and every bite feels like home.',
    image: onboardingImages[0],
  },
  {
    id: '2',
    title: 'Thousands of Flavors',
    subtitle: 'Discover meals crafted with passion from trusted restaurants, local favorites, and hidden culinary gems near you.',
    image: onboardingImages[1],
  },
  {
    id: '3',
    title: 'Delivered with Care',
    subtitle: 'From the kitchen to your doorstep, every order is handled with speed, care, and attention to every detail.',
    image: onboardingImages[2],
  },
  {
    id: '4',
    title: 'Made Just for You',
    subtitle: 'Personalized recommendations, favorite restaurants, exclusive offers, and meals you will keep coming back for.',
    image: onboardingImages[3],
  },
  {
    id: '5',
    title: 'Ready to Taste Something Amazing?',
    subtitle: 'Join thousands of happy food lovers and discover why every order with Buza App feels like a celebration.',
    image: onboardingImages[4],
  }
];
/**
 * Part 2: Screen Component and Screen Navigation Logic
 */

export default function OnboardingScreen({ onExitOnboarding }) {
  const insets = useSafeAreaInsets();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const nextIndex = viewableItems[0]?.index ?? 0;
      setCurrentIndex(nextIndex);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleNextAction = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < onboardingScreensData.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleExitFlow();
    }
  };

  const handleExitFlow = () => {
    if (onExitOnboarding) {
      onExitOnboarding();
    }
  };

  const handleSkip = () => {
    handleExitFlow();
  };

  const isLastScreen = currentIndex === onboardingScreensData.length - 1;
  const nextLabel = isLastScreen ? 'Get Started' : 'Next';
  const skipLabel = 'Skip';

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={[styles.mainContainer, { backgroundColor: ONBOARDING_COLORS.white, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Horizontal View Sliders */}
      <FlatList
        ref={flatListRef}
        data={onboardingScreensData}
        renderItem={({ item }) => (
          <View style={styles.slideWrapper}>
            <View style={styles.upperGraphicSpace}>
              <Image source={item.image} style={styles.cinematicImage} resizeMode="cover" />
              <View style={styles.bottomShadowScrim} />
            </View>
            <View style={styles.lowerTextSpace}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        initialNumToRender={onboardingScreensData.length}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const nextIndex = Math.round(offsetX / width);

          if (nextIndex !== currentIndex) {
            setCurrentIndex(nextIndex);
          }
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Pagination Layout Indicators */}
      <View style={styles.dotsContainer}>
        {onboardingScreensData.map((screen, index) => {
          const isActive = index === currentIndex;
          const dotSize = isActive ? 24 : 8;

          return (
            <Animated.View
              key={screen.id}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: 8,
                  opacity: isActive ? 1 : 0.4,
                  backgroundColor: ONBOARDING_COLORS.primary,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Action Controls Footer Layout */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonCell}>
          {!isLastScreen && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
              <Text style={styles.skipText}>{skipLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonCell}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextAction} activeOpacity={0.85}>
            <Text style={styles.nextText}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
/**
 * Part 3: Component Styling Definition Rules
 */

const styles = StyleSheet.create({
  // Main Container Layouts
  mainContainer: {
    flex: 1,
  },
  slideWrapper: {
    width: width,
    height: '100%',
  },

  // Image and Graphics Area Layouts
  upperGraphicSpace: {
    width: width,
    height: height * 0.55,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cinematicImage: {
    width: '100%',
    height: '100%',
  },
  bottomShadowScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Text and Typography Layouts
  lowerTextSpace: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: ONBOARDING_COLORS.charcoal,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  slideSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: ONBOARDING_COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // Dot Indicator Grid Layouts
  dotsContainer: {
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Interactive Buttons Layouts
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
    marginBottom: 16,
  },
  buttonCell: {
    flex: 1,
    alignItems: 'center',
  },
  skipButton: {
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: ONBOARDING_COLORS.charcoal,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    width: '90%',
    height: 50,
    borderRadius: 25,
    backgroundColor: ONBOARDING_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  nextText: {
    color: ONBOARDING_COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
