import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';

const ALL_USERS = [
  { name: 'SanQua',    color: '#457b9d' },
  { name: 'Hass',      color: '#9b59b6' },
  { name: 'Vit',       color: '#e67e22' },
  { name: 'Cleo',      color: '#e91e63' },
  { name: 'LeMinerale', color: '#2a9d8f' },
];

export default function ContactsTab({ onOpenChat }) {
  const { userAlias } = useContext(AuthContext);
  const myId = (userAlias || '').toLowerCase();

  const contacts = ALL_USERS
    .map(u => ({ ...u, id: u.name.toLowerCase() }))
    .filter(u => u.id !== myId);

  const renderItem = ({ item }) => {
    // Canonical room ID — sama dari kedua sisi
    const roomId = [myId, item.id].sort().join('_');
    return (
      <ContactCard
        contact={item}
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
  list: { paddingVertical: 10, paddingBottom: 30 },
});
