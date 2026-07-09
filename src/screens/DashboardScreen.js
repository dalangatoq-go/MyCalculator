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

// Warna inline — komponen anak sudah pakai centralized theme
const BG     = '#0C0C14';
const CARD   = '#1B1B2A';
const ACCENT = '#7C6BFF';
const TEXT1  = '#EEEDF8';
const TEXT3  = '#4D4C65';
const BORDER = 'rgba(255,255,255,0.07)';

export default function DashboardScreen({ navigation }) {
  const { userAlias } = useContext(AuthContext);

  // Tandai user ini sebagai "online" selama screen ini aktif
  usePresenceHeartbeat((userAlias || '').toLowerCase(), true);

  // bottom nav: 0=Chat, 1=Kontak, 2=Pengaturan
  const [bottomTab, setBottomTab]         = useState(0);
  // top tabs (inside Chat): 0=Chat, 1=Ruang Publik, 2=Lainnya
  const [topTab, setTopTab]               = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText]       = useState('');

  const openChat = ({ roomType, contactId, roomId, roomTitle }) => {
    navigation.navigate('ChatRoom', { roomType, contactId, roomId, roomTitle });
    setBottomTab(0);
  };

  const handleBottomTabChange = (idx) => {
    setBottomTab(idx);
    if (idx === 1) setTopTab(0);
    if (idx !== 0) { setSearchVisible(false); setSearchText(''); }
  };

  const renderMainContent = () => {
    if (bottomTab === 2) return <SettingsTab />;

    if (bottomTab === 1) {
      return (
        <View style={styles.flex}>
          <ContactsListTab onOpenChat={openChat} />
        </View>
      );
    }

    // Chat tab — top tabs + FAB
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
          {topTab === 0 && <ContactsTab onOpenChat={openChat} />}
          {topTab === 1 && <PublicRoomTab onOpenChat={openChat} />}
          {topTab === 2 && <ProjectAreaTab />}
        </View>

        {/* FAB — hanya di tab Chat */}
        {topTab === 0 && (
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => openChat({
              roomType: 'public',
              roomId: 'general_chat',
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
