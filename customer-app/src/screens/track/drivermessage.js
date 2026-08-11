/**
 * Buza Food Delivery Mobile Application
 * Secured In-App Direct Courier Chat Messaging Workspace
 * File: src/screens/drivermessage.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  FlatList, TextInput, KeyboardAvoidingView, Platform, StatusBar, Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const CHAT_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  userBubble: '#FF7F50', courierBubble: '#F0F6F6'
};

const INITIAL_MOCK_CHAT = [
  { id: '1', text: "Hello, I have picked up your food package from the kitchen.", sender: 'courier', time: '11:32 AM' },
  { id: '2', text: "Perfect, thank you for the live update.", sender: 'user', time: '11:33 AM' },
  { id: '3', text: "I am navigating through the gate now, should I leave it at the reception counter?", sender: 'courier', time: '11:35 AM' }
];/**
 * Buza Food Delivery Mobile Application
 * Secured In-App Direct Courier Chat Messaging Workspace
 * File: src/screens/drivermessage.js (Part 2 of 3)
 */

export default function DriverMessageScreen({
  courierName = "Alex K.",
  courierStatus = "Online • Near Destination",
  onBackRoutePress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();
  
  const [chatMessages, setChatMessages] = useState(INITIAL_MOCK_CHAT);
  const [typedMessage, setTypedMessage] = useState('');
  
  const flatListRef = useRef(null);
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleDispatchMessage = () => {
    if (typedMessage.trim().length === 0) return;
    
    const generatedPayload = {
      id: String(chatMessages.length + 1),
      text: typedMessage.trim(),
      sender: 'user',
      time: '11:36 AM'
    };

    setChatMessages((prevMessages) => [...prevMessages, generatedPayload]);
    setTypedMessage('');
    
    // Smooth auto scroll view sequence to display the latest active element
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
/**
 * Buza Food Delivery Mobile Application
 * Secured In-App Direct Courier Chat Messaging Workspace
 * File: src/screens/drivermessage.js (Part 3 of 3)
 */

  const renderMessageBubbleItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubbleWrapperRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        <View style={[styles.chatBubbleFrame, isUser ? styles.userBubbleStyle : styles.courierBubbleStyle]}>
          <Text style={[styles.chatBubbleTextContent, isUser ? { color: '#FFFFFF' } : { color: CHAT_COLORS.textDark }]}>
            {item.text}
          </Text>
          <Text style={[styles.chatTimestampText, isUser ? { color: 'rgba(255,255,255,0.7)' } : { color: CHAT_COLORS.textMuted }]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.masterContainer}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '75%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="message" size={24} color={CHAT_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, opacity: layoutFadeAnim }]}>
        
        {/* Top Header Communications Ribbon */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundBackActionButton} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={CHAT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.courierMetadataBlock}>
            <Text style={styles.courierNameHeader}>{courierName}</Text>
            <Text style={styles.courierStatusSubtitle}>{courierStatus}</Text>
          </View>
          <View style={styles.headerProfileCircle}>
            <CustomIcon name="profile" size={20} color={CHAT_COLORS.textDark} />
          </View>
        </View>

        {/* Live Active Messaging Streams Feed */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageBubbleItem}
          contentContainerStyle={styles.scrollChatContentLayout}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Floating Bottom Interactive Input Text Docking Bar */}
        <View style={[styles.bottomInputDockBar, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.inputFieldBoxWrapper}>
            <TextInput
              style={styles.textInputBoxNode}
              placeholder="Type your message securely..."
              placeholderTextColor={CHAT_COLORS.textMuted + '80'}
              value={typedMessage}
              onChangeText={setTypedMessage}
              multiline
            />
            {/* 100% Round Send Action Trigger Circle Icon */}
            <TouchableOpacity 
              style={[styles.circularSendButton, typedMessage.trim().length === 0 && { opacity: 0.5 }]} 
              activeOpacity={0.8}
              onPress={handleDispatchMessage}
              disabled={typedMessage.trim().length === 0}
            >
              <CustomIcon name="plus" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CHAT_COLORS.background },
  viewportWorkspace: { flex: 1 },
  bubbleWrapperRow: { flexDirection: 'row', width: '100%', paddingHorizontal: 16, marginVertical: 6 },
  
  // Ambient Mesh Backdrop Frame Framework
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Navigation Profile Configuration Ribbon
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: CHAT_COLORS.borderLine, backgroundColor: CHAT_COLORS.background, zIndex: 10 },
  roundBackActionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: CHAT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CHAT_COLORS.borderLine },
  courierMetadataBlock: { flex: 1, paddingHorizontal: 14 },
  courierNameHeader: { fontSize: 16, fontWeight: '800', color: CHAT_COLORS.textDark, letterSpacing: -0.2 },
  courierStatusSubtitle: { fontSize: 12, fontWeight: '600', color: CHAT_COLORS.textMuted, marginTop: 1 },
  headerProfileCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: CHAT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CHAT_COLORS.borderLine },

  // Messaging Structures Feeds Layout
  scrollChatContentLayout: { paddingVertical: 16, paddingHorizontal: 4 },
  chatBubbleFrame: { maxWidth: DEVICE_WIDTH * 0.75, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, shadowColor: CHAT_COLORS.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  userBubbleStyle: { backgroundColor: CHAT_COLORS.userBubble, borderBottomRightRadius: 4 },
  courierBubbleStyle: { backgroundColor: CHAT_COLORS.courierBubble, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: CHAT_COLORS.borderLine },
  chatBubbleTextContent: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  chatTimestampText: { fontSize: 10, fontWeight: '600', textAlign: 'right', marginTop: 4 },

  // Bottom Input Docking Infrastructure Area
  bottomInputDockBar: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: CHAT_COLORS.background, borderTopWidth: 1, borderTopColor: CHAT_COLORS.borderLine },
  inputFieldBoxWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: CHAT_COLORS.surfaceLight, borderRadius: 24, borderWidth: 1, borderColor: CHAT_COLORS.borderLine, paddingHorizontal: 12, paddingVertical: 6 },
  textInputBoxNode: { flex: 1, color: CHAT_COLORS.textDark, fontSize: 14, fontWeight: '600', paddingVertical: 4, paddingHorizontal: 6, maxHeight: 80 },
  circularSendButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: CHAT_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: CHAT_COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 }
});

