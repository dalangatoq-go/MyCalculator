import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ userAlias, onLogout }) {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('[TopBar] Logout gagal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure: {userAlias}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#000' },
  title: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  logout: { color: '#FF4444', fontSize: 14 },
});
