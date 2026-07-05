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
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 18,
    backgroundColor: '#0D0D0F',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.08)',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: { color: '#0D0D0F', fontWeight: '800', fontSize: 18, letterSpacing: -0.5 },
  greeting: { color: '#5A5A62', fontSize: 11, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  alias: { color: '#F0F0F5', fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.25)',
    backgroundColor: 'rgba(255,68,68,0.08)',
  },
  logoutText: { color: '#FF6B6B', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
});
