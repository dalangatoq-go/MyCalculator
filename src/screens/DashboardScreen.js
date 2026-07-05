import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TopTabs from '../components/dashboard/TopTabs';
import ContactsTab from '../components/dashboard/ContactsTab';
import PublicRoomTab from '../components/dashboard/PublicRoomTab';
import ProjectAreaTab from '../components/dashboard/ProjectAreaTab';

export default function DashboardScreen({ navigation }) {
  const { userAlias, signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);

  const openChat = ({ roomType, contactId, roomId, roomTitle }) => {
    navigation.navigate('ChatRoom', { roomType, contactId, roomId, roomTitle });
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <ContactsTab onOpenChat={openChat} />;
      case 1: return <PublicRoomTab onOpenChat={openChat} />;
      case 2: return <ProjectAreaTab />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <DashboardHeader userAlias={userAlias} onLogout={signOut} />
      <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.content}>
        {renderTab()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { flex: 1, backgroundColor: '#0A0A0A' },
});
