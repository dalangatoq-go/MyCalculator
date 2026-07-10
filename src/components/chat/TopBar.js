import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { C, AVATAR_COLORS } from '../../theme/colors';

/**
 * Header layar chat — gaya WhatsApp.
 * isOnline: true      → titik hijau + "Online"
 * isOnline: false      → tidak ada tulisan/titik apa pun (tidak ada "Offline"
 *                          atau "last seen")
 * isOnline: undefined → ruang publik, tidak tampilkan status
 */
export default function TopBar({ userAlias, onLogout, title, onBack, isOnline }) {
  const label    = title || userAlias || 'Chat';
  const initial  = label[0].toUpperCase();
  const avatarBg = AVATAR_COLORS[(title || '').toLowerCase()] || C.accent;

  const handleMore = () => {
    Alert.alert(
      label, '',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar Sesi', style: 'destructive', onPress: onLogout },
      ],
      { cancelable: true },
    );
  };

  // Hanya tampilkan status saat online — tidak ada "Offline"/last seen.
  const statusText  = isOnline === true ? 'Online' : null;
  const statusColor = C.online;

  return (
    <View style={styles.container}>
      {!!onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      )}

      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{label}</Text>
        {statusText !== null && (
          <Text style={[styles.sub, { color: statusColor }]}>{statusText}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleMore}
        style={styles.moreBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.moreIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 46,
    paddingBottom: 12,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    gap: 10,
  },
  backBtn:    {},
  backIcon:   { color: C.accent, fontSize: 32, lineHeight: 34, fontWeight: '300' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  info:       { flex: 1 },
  title:      { color: C.text1, fontSize: 16, fontWeight: '600' },
  sub:        { fontSize: 12, marginTop: 1 },
  moreBtn:    {},
  moreIcon:   { color: C.text2, fontSize: 24, fontWeight: '700' },
});
