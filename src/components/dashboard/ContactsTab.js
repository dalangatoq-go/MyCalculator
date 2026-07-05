import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';

const CONTACTS = [
  { id: 'vit',   name: 'Vit',   status: 'online',  preview: 'Siap!',               time: '10:30', unread: 2 },
  { id: 'luna',  name: 'Luna',  status: 'offline', preview: 'Besok ya...',          time: '09:15', unread: 0 },
  { id: 'alex',  name: 'Alex',  status: 'online',  preview: 'Ok cuy',              time: '08:50', unread: 1 },
  { id: 'sarah', name: 'Sarah', status: 'away',    preview: 'Tunggu sebentar',     time: 'Kemarin', unread: 0 },
  { id: 'niko',  name: 'Niko',  status: 'offline', preview: 'Gak bisa hari ini',   time: 'Kemarin', unread: 0 },
];

export default function ContactsTab({ onOpenChat }) {
  const renderItem = ({ item }) => (
    <ContactCard
      contact={item}
      onPress={() => onOpenChat({ roomType: 'private', contactId: item.id, roomTitle: item.name })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CONTACTS}
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
  container: { flex: 1 },
  list: { paddingVertical: 10, paddingBottom: 30 },
});
