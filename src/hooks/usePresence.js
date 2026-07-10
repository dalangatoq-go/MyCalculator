import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import database from '@react-native-firebase/database';

/**
 * Presence murni berbasis keberadaan node di Realtime Database.
 * Ada node presence/{alias} (= true)  → online.
 * Node tidak ada (dihapus manual atau otomatis oleh onDisconnect saat
 * koneksi socket RTDB putus — termasuk crash/app dibunuh paksa/HP mati)
 * → offline. Tidak ada field status, lastSeen, atau timestamp apa pun.
 */
export function usePresenceHeartbeat(alias, active) {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    if (!alias || !active) return undefined;

    const presenceRef  = database().ref(`presence/${alias}`);
    const connectedRef = database().ref('.info/connected');

    // Daftarkan onDisconnect dulu, baru tulis online — supaya kalau koneksi
    // putus persis di tengah proses ini, server tetap menghapus node begitu
    // socket benar-benar putus (jaring pengaman untuk crash/mati HP).
    const armAndGoOnline = () => {
      presenceRef
        .onDisconnect()
        .remove()
        .then(() => presenceRef.set(true))
        .catch(() => {});
    };

    const goOffline = () => {
      presenceRef.onDisconnect().cancel().catch(() => {});
      presenceRef.remove().catch(() => {});
    };

    // Setiap kali RTDB (re)connect — termasuk pertama kali — daftar ulang
    // onDisconnect dan tulis online, tapi hanya kalau app sedang foreground.
    const onConnectedChange = (snapshot) => {
      if (snapshot.val() === true && AppState.currentState === 'active') {
        armAndGoOnline();
      }
    };
    connectedRef.on('value', onConnectedChange);

    // Keluar dari app (minimize, pindah app lain, tekan home) → offline
    // seketika, tidak menunggu socket timeout.
    const appStateSub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      if (prev.match(/active/) && next.match(/inactive|background/)) {
        goOffline();
      } else if (prev.match(/inactive|background/) && next === 'active') {
        armAndGoOnline();
      }
      appStateRef.current = next;
    });

    return () => {
      connectedRef.off('value', onConnectedChange);
      appStateSub.remove();
      // Keluar via tombol exit / unmount layar → offline seketika.
      goOffline();
    };
  }, [alias, active]);
}

/**
 * Berlangganan keberadaan node presence/{alias} untuk daftar alias.
 * Return via setPresence: { [alias]: boolean } — true jika node ada (online).
 */
export function useContactsPresence(aliases, setPresence) {
  useEffect(() => {
    if (!aliases || aliases.length === 0) return undefined;

    const bindings = aliases.map((alias) => {
      const ref = database().ref(`presence/${alias}`);
      const cb = (snapshot) => {
        setPresence((prev) => ({ ...prev, [alias]: !!snapshot.val() }));
      };
      ref.on('value', cb);
      return { ref, cb };
    });

    return () => bindings.forEach(({ ref, cb }) => ref.off('value', cb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(aliases)]);
}
