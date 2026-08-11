/**
 * Buza Food Delivery Mobile Application
 * Core Account Transmission Logs & Alert Preferences Controller View
 * File: src/screens/notification.js (Part 2 of 3)
 */

export default function NotificationSettingsScreen({
  onSavePreferencesCallback,
  onAbortSelectionPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core Gridded Configuration Toggle States ---
  const [orderTrackingAlerts, setOrderTrackingAlerts] = useState(true);
  const [marketingPromoAlerts, setMarketingPromoAlerts] = useState(false);
  const [courierDirectChatAlerts, setCourierDirectChatAlerts] = useState(true);
  const [platformSystemAlerts, setPlatformSystemAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Animation Vector Channels ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handlePreferencesUpdateSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSavePreferencesCallback?.({
        orderTracking: orderTrackingAlerts,
        marketingPromos: marketingPromoAlerts,
        courierChats: courierDirectChatAlerts,
        systemAlerts: platformSystemAlerts
      });
    }, 1200);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Account Transmission Logs & Alert Preferences Controller View
 * File: src/screens/notification.js (Part 3 of 3)
 */

  const toggleConfigs = [
    { title: 'Logistics Tracking Updates', detail: 'Realtime progress alerts on orders.', state: orderTrackingAlerts, hook: setOrderTrackingAlerts, icon: 'delivery-scooter' },
    { title: 'Marketing Offers & Banners', detail: 'Deals on nearby kitchens and menus.', state: marketingPromoAlerts, hook: setMarketingPromoAlerts, icon: 'star' },
    { title: 'Courier Chat Transmissions', detail: 'Direct messages from assigned couriers.', state: courierDirectChatAlerts, hook: setCourierDirectChatAlerts, icon: 'message' },
    { title: 'System Security Metrics', detail: 'Critical account authorization alerts.', state: platformSystemAlerts, hook: setPlatformSystemAlerts, icon: 'shield-check' }
  ];

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="bell" size={24} color={NOTIF_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortSelectionPress}>
            <CustomIcon name="arrow-left" size={18} color={NOTIF_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.configLabelHeading}>COMMUNICATIONS</Text>
            <Text style={styles.configTitleText}>Alert Profiles</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Top Informational Header Framework */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.bellIconCircle}>
              <CustomIcon name="bell" size={28} color={NOTIF_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Push Preferences</Text>
            <Text style={styles.instructionContextCopy}>Configure systemic broadcast endpoints to fine-tune active order delivery updates, message indicators, and discount tags.</Text>
          </View>

          {/* Vertical Stacked Selection List (100% Round Item Pill Wrappers) */}
          <View style={styles.toggleSelectorVerticalStack}>
            {toggleConfigs.map((config, idx) => (
              <View key={idx} style={styles.toggleRoundRowPill}>
                <View style={styles.toggleContentGroupLeft}>
                  <View style={styles.providerIconWrapperCircle}>
                    <CustomIcon name={config.icon} size={16} color={NOTIF_COLORS.textDark} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.toggleNameLabel}>{config.title}</Text>
                    <Text style={styles.toggleDetailLabel}>{config.detail}</Text>
                  </View>
                </View>
                
                {/* 100% Round Custom Mechanical Toggle Switch Track */}
                <TouchableOpacity
                  style={[styles.switchTrackOuter, config.state ? { backgroundColor: NOTIF_COLORS.toggleActive } : { backgroundColor: NOTIF_COLORS.borderLine }]}
                  activeOpacity={0.9}
                  onPress={() => config.hook(!config.state)}
                >
                  <View style={[styles.switchThumbInnerCircle, config.state ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Layout Save Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primarySaveActionButtonPill, isSaving && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handlePreferencesUpdateSave}
          disabled={isSaving}
        >
          <Text style={styles.primaryActionButtonText}>
            {isSaving ? "Synchronizing Preference Vectors..." : "Save Broadcast Configurations"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: NOTIF_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: NOTIF_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: NOTIF_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: NOTIF_COLORS.borderLine },
  configLabelHeading: { fontSize: 9, fontWeight: '800', color: NOTIF_COLORS.textMuted, letterSpacing: 0.5 },
  configTitleText: { fontSize: 14, fontWeight: '800', color: NOTIF_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  bellIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: NOTIF_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: NOTIF_COLORS.borderLine, marginBottom: 14 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: NOTIF_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: NOTIF_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Vertical Switch Rows Component Framework (100% Round Pills)
  toggleSelectorVerticalStack: { width: '100%', gap: 10, marginTop: 12 },
  toggleRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: NOTIF_COLORS.surfaceLight, borderWidth: 1, borderColor: NOTIF_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10 },
  toggleContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: NOTIF_COLORS.borderLine, marginRight: 12 },
  toggleNameLabel: { fontSize: 14, fontWeight: '800', color: NOTIF_COLORS.textDark },
  toggleDetailLabel: { fontSize: 11, fontWeight: '500', color: NOTIF_COLORS.textMuted, marginTop: 2 },
  
  // Custom Mechanical Toggles (100% Round Components)
  switchTrackOuter: { width: 48, height: 26, borderRadius: 13, padding: 2, justifyContent: 'center' },
  switchThumbInnerCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },

  // 100% Circular Primary Save Action Pill Key
  primarySaveActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: NOTIF_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: NOTIF_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
