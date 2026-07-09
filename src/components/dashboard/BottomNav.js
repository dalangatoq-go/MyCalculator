import React from 'react';
    import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
    import { C } from '../../theme/colors';

    const TABS = [
    { key: 'chat',     label: 'Pesan',      icon: '💬' },
    { key: 'kontak',   label: 'Kontak',     icon: '👥' },
    { key: 'settings', label: 'Pengaturan', icon: '⚙️' },
    ];

    /**
    * Bottom nav — minimal Gen-Z style.
    * Tab aktif: accent color + dot indicator di atas icon.
    */
    export default function BottomNav({ activeTab, onTabChange }) {
    return (
      <View style={styles.container}>
        {TABS.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <TouchableOpacity key={tab.key} style={styles.tab}
              onPress={() => onTabChange(idx)} activeOpacity={0.7}>
              {isActive && <View style={styles.topDot} />}
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
      backgroundColor: C.surface,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border,
      paddingBottom: 22, paddingTop: 6,
    },
    tab:         { flex: 1, alignItems: 'center', paddingVertical: 4 },
    topDot: {
      width: 28, height: 3, backgroundColor: C.accent,
      borderRadius: 2, marginBottom: 4,
    },
    icon:        { fontSize: 20, marginBottom: 3, opacity: 0.35 },
    iconActive:  { opacity: 1 },
    label:       { fontSize: 10.5, color: C.text3, fontWeight: '500' },
    labelActive: { color: C.accent, fontWeight: '700' },
    });
    