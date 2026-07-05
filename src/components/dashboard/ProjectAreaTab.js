import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectCard from './ProjectCard';
import EmptyState from './EmptyState';

const STORAGE_KEY = '@project_area_tasks';

const PRIORITIES = ['low', 'medium', 'high'];

export default function ProjectAreaTab() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) setTasks(JSON.parse(raw));
      })
      .catch(e => console.error('[ProjectAreaTab] load error:', e?.message));
  }, []);

  const persist = useCallback(updated => {
    setTasks(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(
      e => console.error('[ProjectAreaTab] save error:', e?.message),
    );
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      memo: memo.trim(),
      deadline: deadline.trim(),
      priority,
      done: false,
    };
    persist([newTask, ...tasks]);
    setTitle('');
    setMemo('');
    setDeadline('');
    setPriority('medium');
    setShowForm(false);
  };

  const handleToggle = id => {
    persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDelete = id => {
    persist(tasks.filter(t => t.id !== id));
  };

  const PRIORITY_LABELS = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi' };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* Header row: count + add button */}
      <View style={styles.headerRow}>
        <Text style={styles.count}>{tasks.length} item</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(v => !v)}
          activeOpacity={0.8}>
          <Text style={styles.addBtnText}>{showForm ? '✕ Tutup' : '+ Tambah'}</Text>
        </TouchableOpacity>
      </View>

      {/* Add-task form */}
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Judul task"
            placeholderTextColor="#444"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Catatan / memo (opsional)"
            placeholderTextColor="#444"
            value={memo}
            onChangeText={setMemo}
            multiline
            numberOfLines={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Deadline (misal: 10 Jul 2026)"
            placeholderTextColor="#444"
            value={deadline}
            onChangeText={setDeadline}
          />
          <View style={styles.prioRow}>
            <Text style={styles.prioLabel}>Prioritas:</Text>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.prioBtn, priority === p && styles.prioBtnActive]}
                onPress={() => setPriority(p)}>
                <Text style={[styles.prioBtnText, priority === p && styles.prioBtnTextActive]}>
                  {PRIORITY_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleAdd} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task list */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="📋" message="Belum ada task. Tap + Tambah untuk mulai." />
        }
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  count: { color: '#4A4A52', fontSize: 13, fontWeight: '500' },
  addBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  addBtnText: { color: '#0D0D0F', fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },
  form: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    color: '#E8E8EC',
    fontSize: 14,
    marginBottom: 12,
  },
  inputMulti: { minHeight: 60, textAlignVertical: 'top' },
  prioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  prioLabel: { color: '#4A4A52', fontSize: 12, fontWeight: '500', marginRight: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  prioBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
  },
  prioBtnActive: { borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.08)' },
  prioBtnText: { color: '#4A4A52', fontSize: 12, fontWeight: '600' },
  prioBtnTextActive: { color: '#FFD700' },
  saveBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: '#0D0D0F', fontSize: 14, fontWeight: '700' },
  list: { paddingVertical: 4, paddingBottom: 40 },
});
