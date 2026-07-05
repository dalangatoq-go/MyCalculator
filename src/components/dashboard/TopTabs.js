import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const TABS = ['Kontak', 'Ruang Publik', 'Project Area'];

export default function TopTabs({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, idx) => {
        const isActive = activeTab === idx;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(idx)}
            activeOpacity={0.7}>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  activeTab: {},
  label: { fontSize: 13, color: '#555', fontWeight: '500' },
  activeLabel: { color: '#FFD700', fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
});
