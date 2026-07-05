import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useCalculator } from '../hooks/useCalculator';
import Display from '../components/calculator/Display';
import Keypad from '../components/calculator/Keypad';

export default function CalculatorScreen() {
  const { display, handleKeyPress } = useCalculator();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayArea}>
        <Display value={display} />
      </View>
      <Keypad onKeyPress={handleKeyPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  displayArea: { flex: 1, justifyContent: 'flex-end' },
});
