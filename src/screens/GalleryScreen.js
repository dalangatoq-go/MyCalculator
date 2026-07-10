import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { C } from '../theme/colors';

export default function GalleryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gallery</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🖼️</Text>
          <Text style={styles.emptyTitle}>Belum ada media</Text>
          <Text style={styles.emptyDesc}>
            Foto dan file yang dibagikan dalam chat{'\n'}akan muncul di sini.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  backBtn:    {},
  backIcon:   { color: C.accent, fontSize: 32, lineHeight: 34, fontWeight: '300' },
  title:      { color: C.text1, fontSize: 17, fontWeight: '700' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon:  { fontSize: 56, marginBottom: 20 },
  emptyTitle: { color: C.text1, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  emptyDesc:  { color: C.text2, fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
