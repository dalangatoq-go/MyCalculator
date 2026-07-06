import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

const USER_COLORS = {
  sanqua:    '#1565C0',
  hass:      '#2E7D32',
  vit:       '#6A1B9A',
  cleo:      '#AD1457',
  lemineral: '#E65100',
};

export default function SettingsTab() {
  const { userAlias, signOut } = useContext(AuthContext);
  const initial  = userAlias ? userAlias[0].toUpperCase() : '?';
  const avatarBg = USER_COLORS[(userAlias || '').toLowerCase()] || '#333';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('[SettingsTab] logout error:', e?.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{userAlias || 'User'}</Text>
        <Text style={styles.sub}>Anggota aktif</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>🚪  Keluar</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Sky-Secuure Chat · v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F', alignItems: 'center', paddingTop: 40 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    width: '88%',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  name: { color: '#E8E8EC', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sub:  { color: '#555', fontSize: 13 },
  logoutBtn: {
    backgroundColor: 'rgba(255,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  logoutText: { color: '#FF6B6B', fontSize: 15, fontWeight: '600' },
  version: { color: '#2A2A30', fontSize: 12 },
});
