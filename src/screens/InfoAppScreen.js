import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { C } from '../theme/colors';

const INFO_ITEMS = [
  { icon: '📱', label: 'Versi Aplikasi', value: '1.0.0' },
  { icon: '🔐', label: 'Enkripsi', value: 'End-to-end aktif' },
  { icon: '🧩', label: 'Platform', value: 'Android (React Native)' },
  { icon: '☁️', label: 'Backend', value: 'Firebase Firestore' },
  { icon: '🔔', label: 'Notifikasi', value: 'OneSignal Push' },
];

export default function InfoAppScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Info App</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.brandCard}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>S</Text>
            </View>
            <Text style={styles.appName}>Skyline</Text>
            <Text style={styles.appTagline}>Chat aman · Identitas tersembunyi</Text>
          </View>

          <View style={styles.section}>
            {INFO_ITEMS.map((item, idx) => (
              <View
                key={item.label}
                style={[styles.item, idx < INFO_ITEMS.length - 1 && styles.itemBorder]}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <View style={styles.itemBody}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            Dibuat untuk privasi. Tidak ada data yang dijual.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  backBtn:    {},
  backIcon:   { color: C.accent, fontSize: 32, lineHeight: 34, fontWeight: '300' },
  title:      { color: C.text1, fontSize: 17, fontWeight: '700' },
  scroll:     { padding: 18, paddingBottom: 40 },
  brandCard: {
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    marginBottom: 18,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoLetter:  { color: '#FFF', fontSize: 28, fontWeight: '800' },
  appName:     { color: C.text1, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  appTagline:  { color: C.text2, fontSize: 13 },
  section: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  itemIcon:  { fontSize: 18 },
  itemBody:  { flex: 1 },
  itemLabel: { color: C.text2, fontSize: 12, marginBottom: 2 },
  itemValue: { color: C.text1, fontSize: 14, fontWeight: '500' },
  footer:    { color: C.text3, fontSize: 12, textAlign: 'center' },
});
