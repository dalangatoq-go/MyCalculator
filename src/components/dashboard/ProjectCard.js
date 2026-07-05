import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PRIORITY_COLOR = { high: '#FF4444', medium: '#FFC107', low: '#4CAF50' };
const PRIORITY_LABEL = { high: '🔴 Tinggi', medium: '🟡 Sedang', low: '🟢 Rendah' };

export default function ProjectCard({ item, onToggle, onDelete }) {
  const { id, title, memo, deadline, priority, done } = item;
  const prioColor = PRIORITY_COLOR[priority] || '#555';

  return (
    <View style={[styles.card, done && styles.doneCard]}>
      <TouchableOpacity onPress={() => onToggle(id)} style={styles.checkArea}>
        <View style={[styles.check, done && styles.checkDone]}>
          {done && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={[styles.title, done && styles.doneText]} numberOfLines={1}>{title}</Text>
        {!!memo && <Text style={styles.memo} numberOfLines={2}>{memo}</Text>}
        <View style={styles.row}>
          {!!deadline && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>📅 {deadline}</Text>
            </View>
          )}
          {!!priority && (
            <View style={[styles.tag, { borderColor: prioColor }]}>
              <Text style={[styles.tagText, { color: prioColor }]}>
                {PRIORITY_LABEL[priority] || priority}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.del}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 18,
    marginVertical: 5,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  doneCard: { opacity: 0.5 },
  checkArea: { paddingRight: 14, paddingTop: 2 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkDone: {
    backgroundColor: '#FFD700',
    borderColor: 'transparent',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  checkMark: { color: '#0D0D0F', fontSize: 13, fontWeight: '800' },
  body: { flex: 1 },
  title: { color: '#F0F0F5', fontSize: 15, fontWeight: '600', marginBottom: 4, letterSpacing: -0.2 },
  doneText: { textDecorationLine: 'line-through', color: '#4A4A52' },
  memo: { color: '#4A4A52', fontSize: 12, marginBottom: 10, lineHeight: 20, fontWeight: '400' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tagText: { color: '#888', fontSize: 11, fontWeight: '600' },
  del: { color: '#2A2A30', fontSize: 16, paddingLeft: 8, padding: 4 },
});
