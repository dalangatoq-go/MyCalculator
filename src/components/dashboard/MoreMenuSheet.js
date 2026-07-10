import React, { useState, useCallback } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback,
  StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, AVATAR_COLORS } from '../../theme/colors';

const ALL_CONTACTS = [
  { name: 'SanQua',     id: 'sanqua'    },
  { name: 'Hass',       id: 'hass'      },
  { name: 'Vit',        id: 'vit'       },
  { name: 'Cleo',       id: 'cleo'      },
  { name: 'LeMinerale', id: 'lemineral' },
];

/**
 * Bottom sheet untuk tombol ⋮ di header Dashboard (poin 4).
 * Menu: Gallery, Info App, Ganti Nama Kontak.
 */
export default function MoreMenuSheet({ visible, onClose, navigation, customNames, onRename }) {
  const [renameMode, setRenameMode]           = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [nameInput, setNameInput]             = useState('');

  const handleClose = useCallback(() => {
    setRenameMode(false);
    setSelectedContact(null);
    setNameInput('');
    onClose();
  }, [onClose]);

  const openRename = useCallback((contact) => {
    setSelectedContact(contact);
    setNameInput(customNames?.[contact.id] || contact.name);
    setRenameMode(true);
  }, [customNames]);

  const saveRename = useCallback(async () => {
    if (!selectedContact) return;
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    await AsyncStorage.setItem(`@customName_${selectedContact.id}`, trimmed).catch(() => {});
    onRename?.(selectedContact.id, trimmed);
    setRenameMode(false);
    setSelectedContact(null);
    setNameInput('');
  }, [selectedContact, nameInput, onRename]);

  const resetName = useCallback(async () => {
    if (!selectedContact) return;
    await AsyncStorage.removeItem(`@customName_${selectedContact.id}`).catch(() => {});
    onRename?.(selectedContact.id, null);
    setRenameMode(false);
    setSelectedContact(null);
    setNameInput('');
  }, [selectedContact, onRename]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        style={styles.sheetWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {!renameMode ? (
            <>
              <Text style={styles.sheetTitle}>Menu</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { handleClose(); navigation.navigate('Gallery'); }}
                activeOpacity={0.7}>
                <View style={styles.menuIcon}><Text style={styles.menuIconText}>🖼️</Text></View>
                <Text style={styles.menuLabel}>Gallery</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { handleClose(); navigation.navigate('InfoApp'); }}
                activeOpacity={0.7}>
                <View style={styles.menuIcon}><Text style={styles.menuIconText}>ℹ️</Text></View>
                <Text style={styles.menuLabel}>Info App</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemLast]}
                onPress={() => setRenameMode(true)}
                activeOpacity={0.7}>
                <View style={styles.menuIcon}><Text style={styles.menuIconText}>✏️</Text></View>
                <Text style={styles.menuLabel}>Ganti Nama Kontak</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
            </>
          ) : !selectedContact ? (
            <>
              <View style={styles.subHeader}>
                <TouchableOpacity onPress={() => setRenameMode(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.backText}>‹ Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.sheetTitle}>Pilih Kontak</Text>
                <View style={{ width: 70 }} />
              </View>
              <FlatList
                data={ALL_CONTACTS}
                keyExtractor={item => item.id}
                style={styles.contactList}
                renderItem={({ item }) => {
                  const displayName = customNames?.[item.id] || item.name;
                  const avatarBg    = AVATAR_COLORS[item.id] || C.accent;
                  return (
                    <TouchableOpacity style={styles.contactRow} onPress={() => openRename(item)} activeOpacity={0.7}>
                      <View style={[styles.contactAvatar, { backgroundColor: avatarBg }]}>
                        <Text style={styles.contactAvatarText}>{displayName[0].toUpperCase()}</Text>
                      </View>
                      <View style={styles.contactBody}>
                        <Text style={styles.contactName}>{displayName}</Text>
                        {customNames?.[item.id] && customNames[item.id] !== item.name && (
                          <Text style={styles.contactOriginal}>Nama asli: {item.name}</Text>
                        )}
                      </View>
                      <Text style={styles.menuChevron}>›</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          ) : (
            <>
              <View style={styles.subHeader}>
                <TouchableOpacity onPress={() => setSelectedContact(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.backText}>‹ Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.sheetTitle}>Ganti Nama</Text>
                <View style={{ width: 70 }} />
              </View>
              <Text style={styles.renameDesc}>
                Nama baru untuk{' '}
                <Text style={{ color: C.accent }}>
                  {customNames?.[selectedContact.id] || selectedContact.name}
                </Text>
              </Text>
              <TextInput
                style={styles.renameInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Masukkan nama baru..."
                placeholderTextColor={C.text3}
                autoFocus
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={saveRename}
              />
              <View style={styles.renameActions}>
                <TouchableOpacity style={styles.resetBtn} onPress={resetName} activeOpacity={0.8}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, !nameInput.trim() && styles.saveBtnDisabled]}
                  onPress={saveRename}
                  activeOpacity={0.8}>
                  <Text style={styles.saveText}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheetWrap: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  handle: {
    width: 38, height: 4,
    backgroundColor: C.text3,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { color: C.text1, fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    gap: 14,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: C.card,
    justifyContent: 'center', alignItems: 'center',
  },
  menuIconText: { fontSize: 18 },
  menuLabel:    { flex: 1, color: C.text1, fontSize: 15, fontWeight: '500' },
  menuChevron:  { color: C.text3, fontSize: 20 },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backText:          { color: C.accent, fontSize: 15 },
  contactList:       { maxHeight: 280 },
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border,
  },
  contactAvatar:     { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contactAvatarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  contactBody:       { flex: 1 },
  contactName:       { color: C.text1, fontSize: 15, fontWeight: '500' },
  contactOriginal:   { color: C.text3, fontSize: 12, marginTop: 2 },
  renameDesc:        { color: C.text2, fontSize: 13, paddingHorizontal: 20, marginBottom: 14 },
  renameInput: {
    backgroundColor: C.card,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16, paddingVertical: 12,
    color: C.text1, fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.border,
    marginBottom: 16,
  },
  renameActions: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  resetBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(248,113,113,0.25)',
    alignItems: 'center',
  },
  resetText:       { color: C.danger, fontSize: 14, fontWeight: '600' },
  saveBtn:         { flex: 2, paddingVertical: 13, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: C.text3, opacity: 0.4 },
  saveText:        { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
