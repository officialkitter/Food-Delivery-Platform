/**
 * Buza Food Delivery Mobile Application
 * Secure Direct Live Agent Communications View
 * File: src/screens/livechat.js
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, StatusBar, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2', user: '#FF7F50', agent: '#F0F6F6' };

export default function LiveChatScreen({ onBackPress }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([{ id: '1', text: "Hello, thank you for contacting support. How can I assist you today?", sender: 'agent', time: '12:20 PM' }]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(TH)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(driftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(driftY, { toValue: TH, duration: 0, useNativeDriver: true })
      ]))
    ]).start();
  }, []);

  const sendMessage = () => {
    if (input.trim().length === 0) return;
    setMessages(prev => [...prev, { id: String(prev.length + 1), text: input.trim(), sender: 'user', time: '12:26 AM' }]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '75%', transform: [{ translateY: driftY }] }]}><CustomIcon name="message" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ paddingHorizontal: 12, flex: 1 }}><Text style={styles.title}>Support Operator</Text><Text style={styles.status}>Online Secure Handshake</Text></View>
          <View style={styles.pfp}><CustomIcon name="profile" size={20} color={C.textDark} /></View>
        </View>
        <FlatList ref={listRef} data={messages} keyExtractor={item => item.id} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.row, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
                <Text style={[styles.txt, { color: isUser ? '#FFFFFF' : C.textDark }]}>{item.text}</Text>
                <Text style={[styles.time, { color: isUser ? 'rgba(255,255,255,0.7)' : C.textMuted }]}>{item.time}</Text>
              </View>
            </View>
          );
        }} />
        <View style={[styles.dock, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.field} placeholder="Type your message secure..." placeholderTextColor={C.textMuted + '80'} value={input} onChangeText={setInput} multiline />
            <TouchableOpacity style={[styles.send, input.trim().length === 0 && { opacity: 0.5 }]} disabled={input.trim().length === 0} onPress={sendMessage}><CustomIcon name="plus" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} /></TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background }, workspace: { flex: 1 }, drift: { position: 'absolute', opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.background },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  title: { fontSize: 16, fontWeight: '800', color: C.textDark, letterSpacing: -0.2 }, status: { fontSize: 12, fontWeight: '600', color: C.textMuted, marginTop: 1 },
  pfp: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  row: { flexDirection: 'row', width: '100%', marginVertical: 6 },
  bubble: { maxWidth: TW * 0.75, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleUser: { backgroundColor: C.user, borderBottomRightRadius: 4 }, bubbleAgent: { backgroundColor: C.agent, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  txt: { fontSize: 14, fontWeight: '500', lineHeight: 20 }, time: { fontSize: 10, fontWeight: '600', textAlign: 'right', marginTop: 4 },
  dock: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: C.background, borderTopWidth: 1, borderTopColor: C.border },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 24, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 6 },
  field: { flex: 1, color: C.textDark, fontSize: 14, fontWeight: '600', paddingVertical: 4, paddingHorizontal: 6, maxHeight: 80 },
  send: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }
});
