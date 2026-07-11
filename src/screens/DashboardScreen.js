import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  View, TextInput, StyleSheet, TouchableOpacity, Text, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { usePresenceHeartbeat } from '../hooks/usePresence';
import DashboardHeader  from '../components/dashboard/DashboardHeader';
import TopTabs          from '../components/dashboard/TopTabs';
import ContactsTab      from '../components/dashboard/ContactsTab';
import ContactsListTab  from '../components/dashboard/ContactsListTab';
import PublicRoomTab    from '../components/dashboard/PublicRoomTab';
import ProjectAreaTab   from '../components/dashboard/ProjectAreaTab';
import BottomNav        from '../components/dashboard/BottomNav';
import SettingsTab      from '../components/dashboard/SettingsTab';
import MoreMenuSheet    from '../components/dashboard/MoreMenuSheet';

const BG     = '#0C0C14';
const CARD   = '#1B1B2A';
const ACCENT = '#7C6BFF';
const TEXT1  = '#EEEDF8';
const TEXT3  = '#4D4C65';
const BORDER = 'rgba(255,255,255,0.07)';

export default function DashboardScreen({ navigation }) {
  const { userAlias } = useContext(AuthContext);

  usePresenceHeartbeat((userAlias || '').toLowerCase(), true);

  const [bottomTab, setBottomTab]         = useState(0);
  const [topTab,    setTopTab]            = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText,    setSearchText]    = useState('');

  // Poin 4: state bottom sheet menu
  const [showMenu, setShowMenu] = useState(false);

  // Poin 5: lastReadMap → { [roomId]: timestampMs }
  // Disimpan juga ke AsyncStorage (bukan cuma di memory) — sebelumnya reset
  // ke {} setiap kali app dibuka ulang, sehingga pesan yang sudah dibaca
  // sebelumnya tampak seperti belum dibaca lagi (badge merah muncul lagi).
  const LAST_READ_STORAGE_KEY = '@lastReadMap';
  const [lastReadMap,  setLastReadMap]  = useState({});
  const [lastReadLoaded, setLastReadLoaded] = useState(false);

  // Load lastReadMap dari AsyncStorage saat mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LAST_READ_STORAGE_KEY);
        if (raw) setLastReadMap(JSON.parse(raw));
      } catch {}
      setLastReadLoaded(true);
    })();
  }, []);

  // Simpan lastReadMap setiap kali berubah (setelah load awal selesai, agar
  // tidak menimpa data tersimpan dengan {} kosong sebelum load selesai)
  useEffect(() => {
    if (!lastReadLoaded) return;
    AsyncStorage.setItem(LAST_READ_STORAGE_KEY, JSON.stringify(lastReadMap)).catch(() => {});
  }, [lastReadMap, lastReadLoaded]);

  // Poin 4: customNames → { [alias]: string }
  const [customNames, setCustomNames]   = useState({});

  // Load custom names dari AsyncStorage saat mount
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const nameKeys = keys.filter(k => k.startsWith('@customName_'));
        if (nameKeys.length === 0) return;
        const pairs = await AsyncStorage.multiGet(nameKeys);
        const names = {};
        pairs.forEach(([key, val]) => {
          const alias = key.replace('@customName_', '');
          if (val) names[alias] = val;
        });
        setCustomNames(names);
      } catch {}
    })();
  }, []);

  // Callback dari MoreMenuSheet saat nama kontak disimpan/direset
  const handleRename = useCallback((alias, newName) => {
    setCustomNames(prev => {
      const next = { ...prev };
      if (newName) {
        next[alias] = newName;
      } else {
        delete next[alias];
      }
      return next;
    });
  }, []);

  const markRoomRead = useCallback((contactId) => {
    if (!contactId) return;
    setLastReadMap(prev => ({ ...prev, [contactId]: Date.now() }));
  }, []);

  const openChat = ({ roomType, contactId, roomId, roomTitle }) => {
    // Tandai room sebagai sudah dibaca saat masuk...
    if (roomType === 'private' && contactId) {
      markRoomRead(contactId);
    }
    navigation.navigate('ChatRoom', {
      roomType,
      contactId,
      roomId,
      roomTitle,
      // ...dan tandai lagi saat keluar, agar pesan yang tiba & terbaca
      // selama sesi chat ini tidak muncul sebagai belum dibaca di dashboard.
      onLeaveRoom: roomType === 'private' && contactId
        ? () => markRoomRead(contactId)
        : undefined,
    });
    setBottomTab(0);
  };

  const handleBottomTabChange = (idx) => {
    setBottomTab(idx);
    if (idx === 1) setTopTab(0);
    if (idx !== 0) { setSearchVisible(false); setSearchText(''); }
  };

  const renderMainContent = () => {
    // Tab Pengaturan TETAP buka halaman profil (poin 4 — tidak berubah)
    if (bottomTab === 2) return <SettingsTab />;

    if (bottomTab === 1) {
      return (
        <View style={styles.flex}>
          <ContactsListTab onOpenChat={openChat} customNames={customNames} />
        </View>
      );
    }

    return (
      <>
        {searchVisible && (
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Cari pesan atau kontak..."
              placeholderTextColor={TEXT3}
              autoFocus
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchText(''); }}>
              <Text style={styles.searchClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TopTabs activeTab={topTab} onTabChange={setTopTab} />

        <View style={styles.flex}>
          {topTab === 0 && (
            <ContactsTab
              onOpenChat={openChat}
              lastReadMap={lastReadMap}
              customNames={customNames}
            />
          )}
          {topTab === 1 && <PublicRoomTab onOpenChat={openChat} />}
          {topTab === 2 && <ProjectAreaTab />}
        </View>

        {topTab === 0 && (
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => openChat({
              roomType:  'public',
              roomId:    'general_chat',
              roomTitle: 'Ruang Publik',
            })}>
            <Text style={styles.fabIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Poin 4: tombol ⋮ membuka MoreMenuSheet, BUKAN navigasi ke Settings */}
        <DashboardHeader
          onMenuPress={() => {}}
          onSearchPress={() => setSearchVisible(v => !v)}
          onMorePress={() => setShowMenu(true)}
        />
        <View style={styles.flex}>
          {renderMainContent()}
        </View>
        <BottomNav activeTab={bottomTab} onTabChange={handleBottomTabChange} />
      </View>

      <MoreMenuSheet
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        navigation={navigation}
        customNames={customNames}
        onRename={handleRename}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG },
  flex:      { flex: 1 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    gap: 8,
  },
  searchIcon:  { fontSize: 18, color: TEXT3 },
  searchInput: { flex: 1, color: TEXT1, fontSize: 14 },
  searchClose: { color: TEXT3, fontSize: 18 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 14,
    elevation: 8,
  },
  fabIcon: { fontSize: 22 },
});
