import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, Send, Image as ImageIcon, CheckCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import propTypes from 'prop-types';

LiveSupport.propTypes = {
  navigation: propTypes.object.isRequired,
};

export default function LiveSupport({ navigation }) {
  const { styles } = useAppTheme();
  const [messages, setMessages] = useState([
    { id: '1', text: 'System diagnostics linked. Operational desk active. How can we assist you with your current order partition?', sender: 'agent', time: '14:02', image: null },
    { id: '2', text: 'The item arrived without the premium toppings I selected on ItemCustomize.js.', sender: 'user', time: '14:03', image: null }
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: null
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const simulateImageUpload = () => {
    // Inlines a rapid verification dummy asset payload simulating broken container or incorrect modifiers
    const imgMsg = {
      id: Date.now().toString(),
      text: 'Dispute Verification Asset Attached',
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: 'https://unsplash.com'
    };
    setMessages((prev) => [...prev, imgMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[stylesInternal.messageRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        <View style={[
          stylesInternal.bubble, 
          isUser 
            ? { backgroundColor: styles.accentGlow, borderColor: styles.accentBorder, borderBottomRightRadius: 4 } 
            : { backgroundColor: styles.surface, borderColor: 'transparent', borderBottomLeftRadius: 4 }
        ]}>
          {item.image && (
            <Image source={{ uri: item.image }} style={stylesInternal.embeddedImage} resizeMode="cover" />
          )}
          <Text style={[stylesInternal.bubbleText, { color: styles.textPrimary }]}>{item.text}</Text>
          <View style={stylesInternal.metaWrapper}>
            <Text style={[stylesInternal.bubbleTime, { color: styles.textSecondary }]}>{item.time}</Text>
            {isUser && <CheckCheck size={14} color={styles.accentSolid} style={{ marginLeft: 4 }} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[stylesInternal.container, { backgroundColor: styles.background }]}>
      <View style={[stylesInternal.header, { borderBottomWidth: 1, borderBottomColor: styles.accentGlow }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <View style={stylesInternal.headerTitleFrame}>
          <Text style={[stylesInternal.headerMain, { color: styles.textPrimary }]}>Live Agent Portal</Text>
          <Text style={[stylesInternal.headerStatus, { color: styles.accentSolid }]}>Verification Active (ID: #4092)</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={stylesInternal.chatSpace}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={[stylesInternal.inputPanel, { backgroundColor: styles.surface, borderTopWidth: 1, borderTopColor: styles.accentGlow }]}>
          <TouchableOpacity onPress={simulateImageUpload} style={stylesInternal.attachBtn} accessibilityRole="button">
            <ImageIcon size={22} color={styles.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={[stylesInternal.inputField, { color: styles.textPrimary, backgroundColor: styles.background }]}
            placeholder="Type your resolution claim details..."
            placeholderTextColor={styles.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={[stylesInternal.sendBtn, { backgroundColor: styles.accentGlow }]} accessibilityRole="button">
            <Send size={18} color={styles.accentSolid} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const stylesInternal = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitleFrame: { marginLeft: 16 },
  headerMain: { fontSize: 16, fontWeight: '700' },
  headerStatus: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginTop: 1 },
  chatSpace: { padding: 16, paddingBottom: 32 },
  messageRow: { flexDirection: 'row', marginBottom: 16, width: '100%' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, borderWidth: 1 },
  embeddedImage: { width: 200, height: 130, borderRadius: 8, marginBottom: 8 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  metaWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  bubbleTime: { fontSize: 10 },
  inputPanel: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  attachBtn: { padding: 8 },
  inputField: { flex: 1, height: 40, borderRadius: 20, paddingHorizontal: 16, fontSize: 14, marginHorizontal: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});
