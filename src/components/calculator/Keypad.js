import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Keypad({ onKeyPress }) {
  const keys = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
  return (
    <View style={styles.grid}>
      {keys.map((k) => (
        <TouchableOpacity key={k} style={styles.btn} onPress={() => onKeyPress(k)}>
          <Text style={styles.btnText}>{k}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  btn: { width: '25%', height: 80, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 24 }
});
