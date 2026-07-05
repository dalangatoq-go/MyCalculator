import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ userAlias, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure: {userAlias}</Text>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#000' },
  title: { color: '#FFF', fontWeight: 'bold' },
  logout: { color: '#FF4444' }
});
