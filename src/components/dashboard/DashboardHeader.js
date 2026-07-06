import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardHeader({ onMenuPress, onSearchPress, onMorePress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.menu}>☰</Text>
      </TouchableOpacity>

      <View style={styles.brand}>
        <View style={styles.shieldBox}>
          <Text style={styles.shieldIcon}>🔒</Text>
        </View>
        <Text style={styles.brandName}>
          <Text style={styles.blue}>Sky-Secuure</Text>
          <Text style={styles.white}> Chat</Text>
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onSearchPress}
          style={styles.iconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.actionIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMorePress}
          style={styles.iconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.actionIconLg}>⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#0D0D0F',
  },
  menu: { color: '#E8E8EC', fontSize: 20 },
  brand: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  shieldBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1E7BEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  shieldIcon: { fontSize: 16 },
  brandName: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  blue:  { color: '#1E7BEF' },
  white: { color: '#E8E8EC' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 4, padding: 4 },
  actionIcon: { fontSize: 16, color: '#E8E8EC' },
  actionIconLg: { fontSize: 22, color: '#E8E8EC', lineHeight: 24 },
});
