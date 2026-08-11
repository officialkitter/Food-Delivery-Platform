/**
 * Buza Food Delivery Mobile Application
 * Premium Restaurant Menu Catalog Browsing View
 * src/screens/vendorcatalog.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Easing,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width, height } = Dimensions.get('window');

const CAT_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

const RESTA_CAT_TABS = [
  { id: 'all', name: 'Full Menu' },
  { id: 'meals', name: 'Hot Meals' },
  { id: 'drinks', name: 'Cold Drinks' }
];

const CATALOG_ITEMS = [
  { id: '1', name: 'Cheesy Spicy Burger', detail: 'Grilled beef patty, cheddar, hot jalapeños, secret sauce', price: 12500, category: 'meals', image: require('../../assets/images/6.png') },
  { id: '2', name: 'Crispy Fried Chicken', detail: 'Deep fried golden pieces served with spicy dip', price: 14000, category: 'meals', image: require('../../assets/images/7.png') },
  { id: '3', name: 'Ice Cold Passion Fruit Juice', detail: 'Freshly squeezed tropical juice over crushed ice', price: 4000, category: 'drinks', image: require('../../assets/images/8.png') },
  { id: '4', name: 'Creamy Vanilla Shake', detail: 'Thick blended milkshake topped with whipped cream', price: 5500, category: 'drinks', image: require('../../assets/images/9.png') }
];

const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

export default function VendorCatalogScreen({ routeVendor, onSelectDish, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || CAT_COLORS.primary;

  const vendorName = routeVendor?.name || 'Buza Grill House';
  const vendorRating = routeVendor?.rating || '4.9';
  const vendorETA = routeVendor?.ETA || '15-25 min';

  const [activeTab, setActiveTab] = useState('all');
  const [filteredMenu, setFilteredMenu] = useState(CATALOG_ITEMS);

  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(smokeOneOpacity, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
          Animated.timing(smokeOneScale, { toValue: 1.4, duration: 4500, useNativeDriver: true })
        ]),
        Animated.timing(smokeOneOpacity, { toValue: 0, duration: 2700, useNativeDriver: true }),
        Animated.timing(smokeOneScale, { toValue: 1, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      setFilteredMenu(CATALOG_ITEMS);
    } else {
      setFilteredMenu(CATALOG_ITEMS.filter(item => item.category === tabId));
    }
  };
  const renderCategoryTab = ({ item }) => {
    const isActive = activeTab === item.id;
    return (
      <TouchableOpacity 
        style={[styles.tabCell, isActive && { backgroundColor: themePrimary, borderColor: themePrimary }]} 
        onPress={() => handleTabChange(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderCatalogItem = ({ item }) => (
    <TouchableOpacity style={styles.menuRowCard} activeOpacity={0.85} onPress={() => onSelectDish?.(item)}>
      <View style={styles.itemTextDetailsColumn}>
        <Text style={styles.itemNameText}>{item.name}</Text>
        <Text style={styles.itemDetailText} numberOfLines={2}>{item.detail}</Text>
        <Text style={styles.itemPriceText}>{formatTZS(item.price)}</Text>
      </View>
      <Image source={item.image} style={styles.itemThumbnailImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Decorative Atmosphere Elements and Floating Steam Matrix */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 12, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* UPPER NAVIGATION BAR WITH VENDOR SUMMARY DETAILS */}
        <View style={styles.topHeaderControlRow}>
          <TouchableOpacity style={styles.backCircleBtnFrame} onPress={onBackPress} activeOpacity={0.7}>
            <CustomIcon name="arrow-left" size={18} color={CAT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.headerInfoBlock}>
            <Text style={styles.mainHeadingTitle}>{vendorName}</Text>
            <View style={styles.vendorMetaSubRow}>
              <View style={styles.metaCell}>
                <CustomIcon name="star" size={12} color={CAT_COLORS.primary} />
                <Text style={styles.metaValueText}>{vendorRating}</Text>
              </View>
              <View style={styles.metaDotDivider} />
              <View style={styles.metaCell}>
                <CustomIcon name="clock" size={12} color={CAT_COLORS.textMuted} />
                <Text style={styles.metaValueText}>{vendorETA}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* HORIZONTAL CATALOG FILTER SECTION */}
        <View style={styles.tabsSliderWrapper}>
          <FlatList 
            data={RESTA_CAT_TABS}
            renderItem={renderCategoryTab}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContentPadding}
          />
        </View>

        {/* DYNAMIC MENU ITEMS FLATLIST GRID */}
        <FlatList
          data={filteredMenu}
          renderItem={renderCatalogItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listScrollPadding, { paddingBottom: Math.max(insets.bottom, 16) }]}
        />

      </Animated.View>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CAT_COLORS.background },
  contentWorkspace: { flex: 1 },
  topHeaderControlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  backCircleBtnFrame: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: CAT_COLORS.borderLine },
  headerInfoBlock: { marginLeft: 16, flex: 1 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: CAT_COLORS.textDark, letterSpacing: -0.5 },
  vendorMetaSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaCell: { flexDirection: 'row', alignItems: 'center' },
  metaValueText: { fontSize: 13, fontWeight: '700', color: CAT_COLORS.textDark, marginLeft: 4 },
  metaDotDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(30, 107, 123, 0.3)', marginHorizontal: 10 },
  tabsSliderWrapper: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: CAT_COLORS.borderLine, paddingBottom: 12 },
  tabsContentPadding: { paddingHorizontal: 24 },
  tabCell: { backgroundColor: CAT_COLORS.surfaceLight, borderWidth: 1, borderColor: CAT_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tabText: { fontSize: 13, fontWeight: '700', color: CAT_COLORS.textMuted },
  tabTextActive: { color: '#FFFFFF' },
  listScrollPadding: { paddingHorizontal: 24, paddingBottom: 24 },
  menuRowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: CAT_COLORS.borderLine, padding: 14, marginBottom: 14, shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  itemTextDetailsColumn: { flex: 1, paddingRight: 16 },
  itemNameText: { fontSize: 15, fontWeight: '800', color: CAT_COLORS.textDark, marginBottom: 4 },
  itemDetailText: { fontSize: 12, fontWeight: '600', color: CAT_COLORS.textMuted, lineHeight: 17, marginBottom: 8 },
  itemPriceText: { fontSize: 14, fontWeight: '800', color: CAT_COLORS.primary },
  itemThumbnailImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: CAT_COLORS.surfaceLight },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.45, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
