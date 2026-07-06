import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  { key: 'chat',      label: 'Chat',       icon: '💬' },
  { key: 'kontak',    label: 'Kontak',     icon: '👤' },
  { key: 'settings',  label: 'Pengaturan', icon: '⚙️' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, idx) => {
        const isActive = activeTab === idx;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(idx)}
            activeOpacity={0.7}>
            <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#131316',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  icon:        { fontSize: 22, marginBottom: 3, opacity: 0.4 },
  iconActive:  { opacity: 1 },
  label:       { fontSize: 11, color: '#555', fontWeight: '500' },
  labelActive: { color: '#1E7BEF', fontWeight: '700' },
});
