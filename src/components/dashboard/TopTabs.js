import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../theme/colors';

const TABS = ['Chat', 'Ruang Publik', 'Lainnya'];

/**
 * Top tab bar — gaya WhatsApp dengan indikator garis bawah accent indigo.
 */
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
              {tab === 'Ruang Publik' && publicUnread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {publicUnread > 99 ? '99+' : String(publicUnread)}
                  </Text>
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
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    position: 'relative',
  },
  labelRow:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label:       { fontSize: 13, color: C.text3, fontWeight: '500' },
  activeLabel: { color: C.accent, fontWeight: '700' },
  badge: {
    backgroundColor: C.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText:  { color: '#FFF', fontSize: 10, fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    backgroundColor: C.accent,
    borderRadius: 2,
  },
});
