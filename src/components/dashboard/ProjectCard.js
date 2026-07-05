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
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#222',
  },
  doneCard: { opacity: 0.55 },
  checkArea: { paddingRight: 12, paddingTop: 2 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkDone: { backgroundColor: '#FFD700' },
  checkMark: { color: '#000', fontSize: 13, fontWeight: '700' },
  body: { flex: 1 },
  title: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  doneText: { textDecorationLine: 'line-through', color: '#555' },
  memo: { color: '#777', fontSize: 12, marginBottom: 6, lineHeight: 18 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { color: '#888', fontSize: 11 },
  del: { color: '#444', fontSize: 18, paddingLeft: 8 },
});
