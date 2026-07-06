import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = ['Kontak', 'Ruang Publik', 'Project Area'];

export default function TopTabs({ activeTab, onTabChange, publicUnread = 0 }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab, idx) => {
        const isActive = activeTab === idx;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onTabChange(idx)}
            activeOpacity={0.7}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{tab}</Text>
              {tab === 'Ruang Publik' && (
                <View style={[styles.badge, publicUnread > 0 && styles.badgeActive]}>
                  <Text style={styles.badgeText}>{publicUnread > 99 ? '99+' : publicUnread}</Text>
                </View>
              )}
            </View>
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
    backgroundColor: '#0D0D0F',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: { fontSize: 13, color: '#555', fontWeight: '500' },
  activeLabel: { color: '#1E7BEF', fontWeight: '700' },
  badge: {
    backgroundColor: '#1E7BEF',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeActive: { backgroundColor: '#1E7BEF' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: '#1E7BEF',
    borderRadius: 2,
  },
});
