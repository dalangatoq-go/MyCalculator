import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../contexts/AuthContext';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';

// ID eksplisit — konsisten dengan AVATAR_COLORS di ContactCard & MoreMenuSheet
const ALL_USERS = [
  { name: 'SanQua',     id: 'sanqua',    color: '#1565C0' },
  { name: 'Hass',       id: 'hass',      color: '#2E7D32' },
  { name: 'Vit',        id: 'vit',       color: '#6A1B9A' },
  { name: 'Cleo',       id: 'cleo',      color: '#AD1457' },
  { name: 'LeMinerale', id: 'lemineral', color: '#E65100' },
];

const TYPING_STALE_MS = 6000;

/**
 * Tab Chat — daftar percakapan privat.
 * lastReadMap: { [roomId]: timestampMs } — dikelola DashboardScreen.
 * customNames: { [alias]: string } — nama kustom kontak.
 */
export default function ContactsTab({ onOpenChat, lastReadMap = {}, customNames = {} }) {
  const { userAlias } = useContext(AuthContext);
  const myId = (userAlias || '').toLowerCase();

  const contacts = ALL_USERS
    .map(u => ({
      ...u,
      name: customNames[u.id] || u.name,
    }))
    .filter(u => u.id !== myId);

  const [lastMessages, setLastMessages] = useState({});
  const [typingMap,    setTypingMap]    = useState({});

  // ── Listener pesan per room (last 30 untuk hitung unread) ────────
  useEffect(() => {
    if (!myId) return undefined;

    const unsubs = contacts.map(contact => {
      const roomId = [myId, contact.id].sort().join('_');
      return firestore()
        .collection(`private_${roomId}`)
        .orderBy('createdAt', 'desc')
        .limit(30)
        .onSnapshot(
          snap => {
            if (snap.empty) return;
            const docs  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            const last  = docs[0];
            const lastReadTs = lastReadMap[roomId] || 0;

            const unread = docs.filter(msg => {
              if ((msg.userAlias || '').toLowerCase() === myId) return false;
              const msgMs = msg.createdAt?.toMillis
                ? msg.createdAt.toMillis()
                : msg.createdAt ? new Date(msg.createdAt).getTime() : 0;
              return msgMs > lastReadTs;
            }).length;

            setLastMessages(prev => ({
              ...prev,
              [contact.id]: {
                text:   last?.text       || '',
                time:   last?.createdAt  || null,
                unread,
              },
            }));
          },
          () => {},
        );
    });

    return () => unsubs.forEach(u => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, JSON.stringify(lastReadMap)]);

  // ── Listener typing per room (poin 7) ───────────────────────────
  useEffect(() => {
    if (!myId) return undefined;

    const unsubs = contacts.map(contact => {
      const roomId = [myId, contact.id].sort().join('_');
      return firestore()
        .collection('typing')
        .doc(`private_${roomId}`)
        .onSnapshot(
          doc => {
            const data = doc.data() || {};
            const now  = Date.now();
            const isTyping = Object.entries(data).some(([alias, ts]) => {
              if (alias === myId)        return false;
              if (alias !== contact.id)  return false;
              const ms = ts?.toMillis ? ts.toMillis() : 0;
              return now - ms < TYPING_STALE_MS;
            });
            setTypingMap(prev => ({ ...prev, [contact.id]: isTyping }));
          },
          () => {},
        );
    });

    return () => unsubs.forEach(u => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const chatList = contacts
    .filter(c => !!lastMessages[c.id] || !!typingMap[c.id])
    .sort((a, b) => {
      if (typingMap[a.id] && !typingMap[b.id]) return -1;
      if (!typingMap[a.id] && typingMap[b.id]) return  1;
      const ta = lastMessages[a.id]?.time?.toMillis ? lastMessages[a.id].time.toMillis() : 0;
      const tb = lastMessages[b.id]?.time?.toMillis ? lastMessages[b.id].time.toMillis() : 0;
      return tb - ta;
    });

  const renderItem = useCallback(({ item }) => {
    const roomId = [myId, item.id].sort().join('_');
    return (
      <ContactCard
        contact={item}
        lastMessage={lastMessages[item.id] || null}
        isTyping={!!typingMap[item.id]}
        onPress={() => onOpenChat({
          roomType:  'private',
          contactId: roomId,
          roomTitle: item.name,
        })}
      />
    );
  }, [myId, lastMessages, typingMap, onOpenChat]);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="💬" message="Belum ada percakapan" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  list:      { paddingBottom: 30 },
});
