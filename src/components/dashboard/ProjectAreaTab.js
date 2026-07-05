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
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  count: { color: '#666', fontSize: 13 },
  addBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  addBtnText: { color: '#000', fontSize: 13, fontWeight: '700' },
  form: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  input: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    padding: 10,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },
  inputMulti: { minHeight: 60, textAlignVertical: 'top' },
  prioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  prioLabel: { color: '#666', fontSize: 13, marginRight: 4 },
  prioBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  prioBtnActive: { borderColor: '#FFD700', backgroundColor: '#FFD70022' },
  prioBtnText: { color: '#555', fontSize: 12, fontWeight: '600' },
  prioBtnTextActive: { color: '#FFD700' },
  saveBtn: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  saveBtnText: { color: '#000', fontSize: 14, fontWeight: '700' },
  list: { paddingVertical: 4, paddingBottom: 40 },
});
