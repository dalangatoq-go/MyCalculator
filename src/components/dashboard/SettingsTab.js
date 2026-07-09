import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { C, AVATAR_COLORS } from '../../theme/colors';

/**
 * Tab Pengaturan — profil user + info enkripsi + tombol logout.
 * Logout meminta konfirmasi Alert dulu.
 */
export default function SettingsTab() {
  const { userAlias, signOut } = useContext(AuthContext);
  const initial  = userAlias ? userAlias[0].toUpperCase() : '?';
  const avatarBg = AVATAR_COLORS[(userAlias || '').toLowerCase()] || C.accent;

  const handleLogout = () => {
    Alert.alert(
      'Keluar Sesi',
      'Yakin ingin keluar? Kamu harus memasukkan kode lagi untuk masuk.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try { await signOut(); }
            catch (e) { console.error('[SettingsTab] logout:', e?.message); }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{userAlias || 'User'}</Text>
        <Text style={styles.sub}>Anggota aktif · Sesi anonim</Text>
      </View>

      {/* Info section */}
      <View style={styles.section}>
        <View style={styles.sectionItem}>
          <Text style={styles.itemIcon}>🔒</Text>
          <View style={styles.itemBody}>
            <Text style={styles.itemLabel}>Enkripsi</Text>
            <Text style={styles.itemValue}>End-to-end aktif</Text>
          </View>
        </View>
        <View style={[styles.sectionItem, styles.lastItem]}>
          <Text style={styles.itemIcon}>👤</Text>
          <View style={styles.itemBody}>
            <Text style={styles.itemLabel}>Mode</Text>
            <Text style={styles.itemValue}>Anonim · identitas tersembunyi</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Keluar Sesi</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Skyline · v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.bg, paddingTop: 20 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    marginBottom: 18,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#7C6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText:  { color: '#FFF', fontSize: 30, fontWeight: '700' },
  name:        { color: C.text1, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sub:         { color: C.text2, fontSize: 13 },
  section: {
    backgroundColor: C.card,
    borderRadius: 16,
    marginHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    marginBottom: 18,
    overflow: 'hidden',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  lastItem:  { borderBottomWidth: 0 },
  itemIcon:  { fontSize: 18 },
  itemBody:  { flex: 1 },
  itemLabel: { color: C.text2, fontSize: 12, marginBottom: 2 },
  itemValue: { color: C.text1, fontSize: 14, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 18,
    paddingVertical: 15,
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(248,113,113,0.25)',
    marginBottom: 20,
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { color: C.danger, fontSize: 15, fontWeight: '600' },
  version:    { color: C.text3, fontSize: 12, textAlign: 'center' },
});
