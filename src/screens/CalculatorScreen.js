import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useCalculator } from '../hooks/useCalculator';

export default function CalculatorScreen({ navigation }) {
  const { display, handleKeyPress } = useCalculator();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.keypad}>
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (
          <TouchableOpacity key={btn} style={styles.button} onPress={() => handleKeyPress(btn)}>
            <Text style={styles.buttonText}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  displayContainer: { padding: 30, alignItems: 'flex-end' },
  displayText: { color: '#FFD700', fontSize: 48 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  button: { width: '25%', height: 80, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 24 }
});
