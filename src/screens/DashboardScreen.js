import React, { useState, useContext } from 'react';
import {
  View, TextInput, StyleSheet, TouchableOpacity, Text, SafeAreaView,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { usePresenceHeartbeat } from '../hooks/usePresence';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TopTabs from '../components/dashboard/TopTabs';
import ContactsTab from '../components/dashboard/ContactsTab';
import ContactsListTab from '../components/dashboard/ContactsListTab';
import PublicRoomTab from '../components/dashboard/PublicRoomTab';
import ProjectAreaTab from '../components/dashboard/ProjectAreaTab';
import BottomNav from '../components/dashboard/BottomNav';
import SettingsTab from '../components/dashboard/SettingsTab';

export default function DashboardScreen({ navigation }) {
  const { userAlias, signOut } = useContext(AuthContext);

  // Dashboard hanya mount saat UI ter-autentikasi → alias ini dianggap
  // "online" secara real selama komponen ini hidup & app di foreground.
  usePresenceHeartbeat((userAlias || '').toLowerCase(), true);

  // Bottom nav: 0=Chat, 1=Kontak, 2=Pengaturan
  const [bottomTab, setBottomTab] = useState(0);
  // Top tabs (inside Chat bottom tab): 0=Chat, 1=Ruang Publik, 2=Project Area
  const [topTab, setTopTab] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const openChat = ({ roomType, contactId, roomId, roomTitle }) => {
    navigation.navigate('ChatRoom', { roomType, contactId, roomId, roomTitle });
    setBottomTab(0);
  };

  const handleBottomTabChange = (idx) => {
    setBottomTab(idx);
    if (idx === 1) setTopTab(0);   // Kontak → langsung ke tab Kontak
    if (idx !== 0) {               // Tutup search bar saat keluar dari tab Chat
      setSearchVisible(false);
      setSearchText('');
    }
  };

  const renderMainContent = () => {
    // Settings bottom tab
    if (bottomTab === 2) {
      return <SettingsTab />;
    }

    // Kontak bottom tab → daftar kontak polos, layar penuh, tanpa
    // top tabs/FAB (bukan tampilan chat, cuma phonebook + status online).
    if (bottomTab === 1) {
      return (
        <View style={styles.tabContent}>
          <ContactsListTab onOpenChat={openChat} />
        </View>
      );
    }

    // Chat bottom tab → top tabs (Chat / Ruang Publik / Project Area)
    return (
      <>
        {/* Search bar */}
        {searchVisible && (
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Cari pesan atau kontak..."
              placeholderTextColor="#444"
              autoFocus
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchText(''); }}>
              <Text style={styles.searchClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TopTabs activeTab={topTab} onTabChange={setTopTab} />

        <View style={styles.tabContent}>
          {topTab === 0 && <ContactsTab onOpenChat={openChat} />}
          {topTab === 1 && <PublicRoomTab onOpenChat={openChat} />}
          {topTab === 2 && <ProjectAreaTab />}
        </View>

        {/* FAB — only on Chat tab */}
        {topTab === 0 && (
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => openChat({ roomType: 'public', roomId: 'general_chat', roomTitle: 'Ruang Publik' })}>
            <Text style={styles.fabIcon}>💬</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <DashboardHeader
          onMenuPress={() => {}}
          onSearchPress={() => setSearchVisible(v => !v)}
          onMorePress={() => setBottomTab(2)}
        />
        <View style={styles.flex}>
          {renderMainContent()}
        </View>
        <BottomNav activeTab={bottomTab} onTabChange={handleBottomTabChange} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#0D0D0F' },
  container:  { flex: 1, backgroundColor: '#0D0D0F' },
  flex:       { flex: 1 },
  tabContent: { flex: 1 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1D',
    marginHorizontal: 14,
    marginVertical: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchIcon:  { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: '#E8E8EC', fontSize: 14 },
  searchClose: { color: '#555', fontSize: 16, marginLeft: 8 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#1E7BEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E7BEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { fontSize: 24 },
});
