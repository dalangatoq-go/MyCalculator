import React from 'react';
    import { View, Text, StyleSheet } from 'react-native';
    import { C } from '../../theme/colors';

    export default function EmptyState({ icon = '📭', message = 'Tidak ada data' }) {
    return (
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
    iconWrap: {
      width: 72, height: 72, borderRadius: 24,
      backgroundColor: C.accentDim,
      justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    icon:    { fontSize: 34 },
    message: { color: C.text3, fontSize: 14, textAlign: 'center', fontWeight: '500' },
    });
    