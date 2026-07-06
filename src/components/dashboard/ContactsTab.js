import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../contexts/AuthContext';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';

const ALL_USERS = [
  { name: 'SanQua',     color: '#1565C0' },
  { name: 'Hass',       color: '#2E7D32' },
  { name: 'Vit',        color: '#6A1B9A' },
  { name: 'Cleo',       color: '#AD1457' },
  { name: 'LeMinerale', color: '#E65100' },
];

export default function ContactsTab({ onOpenChat }) {
  const { userAlias } = useContext(AuthContext);
  const myId = (userAlias || '').toLowerCase();

  const contacts = ALL_USERS
    .map(u => ({ ...u, id: u.name.toLowerCase() }))
    .filter(u => u.id !== myId);

  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    if (!myId) return;

    const unsubs = contacts.map(contact => {
      const roomId = [myId, contact.id].sort().join('_');
      return firestore()
        .collection(`private_${roomId}`)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(
          snap => {
            if (snap.empty) return;
            const doc = snap.docs[0].data();
            setLastMessages(prev => ({
              ...prev,
              [contact.id]: { text: doc.text || '', time: doc.createdAt },
            }));
          },
          () => {},
        );
    });

    return () => unsubs.forEach(u => u());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const renderItem = ({ item }) => {
    const roomId = [myId, item.id].sort().join('_');
    return (
      <ContactCard
        contact={item}
        lastMessage={lastMessages[item.id] || null}
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
