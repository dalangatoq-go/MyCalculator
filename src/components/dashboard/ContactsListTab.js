import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useContactsPresence } from '../../hooks/usePresence';
import PlainContactRow from './PlainContactRow';
import EmptyState from './EmptyState';

const ALL_USERS = [
  { name: 'SanQua',     color: '#1565C0' },
  { name: 'Hass',       color: '#2E7D32' },
  { name: 'Vit',        color: '#6A1B9A' },
  { name: 'Cleo',       color: '#AD1457' },
  { name: 'LeMinerale', color: '#E65100' },
];

/**
 * Daftar kontak polos (bukan gaya chat) untuk tab bawah "Kontak".
 * Menampilkan status online/offline real dari koleksi `presence`,
 * dan waktu aktif terakhir jika sedang offline.
 */
export default function ContactsListTab({ onOpenChat }) {
  const { userAlias } = useContext(AuthContext);
  const myId = (userAlias || '').toLowerCase();

  const contacts = ALL_USERS
    .map(u => ({ ...u, id: u.name.toLowerCase() }))
    .filter(u => u.id !== myId);

  const [presence, setPresence] = useState({});
  useContactsPresence(contacts.map(c => c.id), setPresence);

  const renderItem = ({ item }) => {
    const roomId = [myId, item.id].sort().join('_');
    return (
      <PlainContactRow
        contact={item}
        presence={presence[item.id]}
        onPress={() => onOpenChat({
          roomType: 'private',
          contactId: roomId,
          roomTitle: item.name,
        })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="👥" message="Tidak ada kontak" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  list: { paddingBottom: 30 },
});
