import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardHeader({ userAlias, onLogout }) {
  const initial = userAlias ? userAlias[0].toUpperCase() : '?';

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (e) {
      console.error('[DashboardHeader] logout error:', e?.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.alias}>{userAlias || 'User'}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#0A0A0A', fontWeight: 'bold', fontSize: 18 },
  greeting: { color: '#666', fontSize: 12 },
  alias: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  logoutText: { color: '#FF4444', fontSize: 13, fontWeight: '600' },
});
