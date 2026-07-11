import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { C } from '../../theme/colors';

// Sama seperti TopBar: header ini ada di dalam SafeAreaView (yang sudah
// menangani inset di iOS). Di Android, tambahkan tinggi status bar + margin
// kecil yang wajar alih-alih angka tetap besar yang membuat ruang kosong.
const HEADER_TOP_SPACING = Platform.select({
  ios: 8,
  android: (StatusBar.currentHeight || 24) + 8,
  default: 8,
});

/**
 * Header utama dashboard — gaya WhatsApp.
 * Logo "S" (indigo) + brand name kiri, search + more kanan.
 */
export default function DashboardHeader({ onMenuPress, onSearchPress, onMorePress }) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>S</Text>
        </View>
        <Text style={styles.brandName}>Skyline</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onSearchPress}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}>
          <Text style={styles.iconText}>⌕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMorePress}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: HEADER_TOP_SPACING,
    paddingBottom: 14,
    backgroundColor: C.surface,
  },
  brand:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  brandName:  { color: C.text1, fontSize: 22, fontWeight: '700', letterSpacing: -0.4 },
  actions:    { flexDirection: 'row', gap: 4 },
  iconBtn:    { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  iconText:   { color: C.text2, fontSize: 22, fontWeight: '600' },
});
