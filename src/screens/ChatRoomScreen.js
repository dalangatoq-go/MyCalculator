import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatRoomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Room Rahasia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', fontSize: 18 }
});
