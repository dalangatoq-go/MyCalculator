import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ userAlias, onLogout, title, onBack }) {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('[TopBar] Logout gagal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {!!onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title || `Secure: ${userAlias}`}
        </Text>
      </View>
      <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  backBtn: { marginRight: 6 },
  backIcon: { color: '#FFD700', fontSize: 28, lineHeight: 30 },
  title: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', flex: 1 },
  logout: { color: '#FF4444', fontSize: 14 },
});
