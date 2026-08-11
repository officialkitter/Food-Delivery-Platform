import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';
import { CustomIcon } from './CustomIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PremiumMotionBackdrop = () => {
  const scooterX = useRef(new Animated.Value(-120)).current;
  const scooterBob = useRef(new Animated.Value(0)).current;

  const bubbleOneY = useRef(new Animated.Value(0)).current;
  const bubbleTwoY = useRef(new Animated.Value(0)).current;
  const bubbleThreeY = useRef(new Animated.Value(0)).current;

  const burgerY = useRef(new Animated.Value(SCREEN_HEIGHT + 40)).current;
  const cocktailY = useRef(new Animated.Value(SCREEN_HEIGHT + 140)).current;

  useEffect(() => {
    const scooterPass = Animated.loop(
      Animated.timing(scooterX, {
        toValue: SCREEN_WIDTH + 120,
        duration: 6200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const scooterBounce = Animated.loop(
      Animated.sequence([
        Animated.timing(scooterBob, {
          toValue: -5,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scooterBob, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const bubbleFloat = (anim, amplitude, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -amplitude,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

    const emojiStream = (anim, duration, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -120,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

    const bubbleOne = bubbleFloat(bubbleOneY, 18, 2200);
    const bubbleTwo = bubbleFloat(bubbleTwoY, 24, 2600);
    const bubbleThree = bubbleFloat(bubbleThreeY, 14, 1800);

    const burgerStream = emojiStream(burgerY, 7200, 0);
    const cocktailStream = emojiStream(cocktailY, 8600, 1200);

    scooterPass.start();
    scooterBounce.start();
    bubbleOne.start();
    bubbleTwo.start();
    bubbleThree.start();
    burgerStream.start();
    cocktailStream.start();

    return () => {
      scooterPass.stop();
      scooterBounce.stop();
      bubbleOne.stop();
      bubbleTwo.stop();
      bubbleThree.stop();
      burgerStream.stop();
      cocktailStream.stop();
    };
  }, [
    bubbleOneY,
    bubbleTwoY,
    bubbleThreeY,
    burgerY,
    cocktailY,
    scooterBob,
    scooterX,
  ]);

  return (
    <View style={styles.canvas} pointerEvents="none">
      <Animated.View style={[styles.salmonCircleLarge, { transform: [{ translateY: bubbleOneY }] }]} />
      <Animated.View style={[styles.salmonCircleMedium, { transform: [{ translateY: bubbleTwoY }] }]} />
      <Animated.View style={[styles.salmonCircleSmall, { transform: [{ translateY: bubbleThreeY }] }]} />

      <Animated.View style={[styles.scooterLane, { transform: [{ translateX: scooterX }, { translateY: scooterBob }] }]}>
        <CustomIcon name="delivery-scooter" size={34} color="#1E6B7B" />
      </Animated.View>

      <Animated.Text style={[styles.reactionEmoji, styles.burgerEmoji, { transform: [{ translateY: burgerY }] }]}>🍔</Animated.Text>
      <Animated.Text style={[styles.reactionEmoji, styles.cocktailEmoji, { transform: [{ translateY: cocktailY }] }]}>🍹</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 20,
  },
  scooterLane: {
    position: 'absolute',
    top: '49%',
    shadowColor: '#052A30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  salmonCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -50,
    top: 80,
    backgroundColor: 'rgba(255, 160, 122, 0.20)',
  },
  salmonCircleMedium: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    left: -30,
    top: '38%',
    backgroundColor: 'rgba(255, 160, 122, 0.16)',
  },
  salmonCircleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    right: 26,
    bottom: 140,
    backgroundColor: 'rgba(255, 160, 122, 0.18)',
  },
  reactionEmoji: {
    position: 'absolute',
    fontSize: 28,
    opacity: 0.05,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  burgerEmoji: {
    left: '14%',
  },
  cocktailEmoji: {
    left: '79%',
  },
});
