import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const HEARTBEAT_MS = 25000;

/**
 * Menulis status online/offline user ke koleksi `presence/{alias}`.
 * Hanya dianggap "online" selama dashboard benar-benar terbuka (UI
 * ter-autentikasi) DAN app sedang di foreground — bukan sekadar app
 * ter-install / sesi Firebase aktif di background.
 */
export function usePresenceHeartbeat(alias, active) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!alias || !active) return undefined;

    const ref = firestore().collection('presence').doc(alias);

    const setOnline = () => {
      ref.set({ online: true, lastActive: firestore.FieldValue.serverTimestamp() }, { merge: true })
        .catch(() => {});
    };
    const setOffline = () => {
      ref.set({ online: false, lastActive: firestore.FieldValue.serverTimestamp() }, { merge: true })
        .catch(() => {});
    };

    setOnline();
    const heartbeat = setInterval(() => {
      if (AppState.currentState === 'active') setOnline();
    }, HEARTBEAT_MS);

    const sub = AppState.addEventListener('change', (next) => {
      if (appState.current.match(/active/) && next.match(/inactive|background/)) {
        setOffline();
      } else if (appState.current.match(/inactive|background/) && next === 'active') {
        setOnline();
      }
      appState.current = next;
    });

    return () => {
      clearInterval(heartbeat);
      sub.remove();
      setOffline();
    };
  }, [alias, active]);
}

/**
 * Berlangganan status online/lastActive real-time untuk daftar alias.
 * Return: { [alias]: { online: boolean, lastActive: Timestamp|null } }
 */
export function useContactsPresence(aliases, setPresence) {
  useEffect(() => {
    if (!aliases || aliases.length === 0) return undefined;

    const unsubs = aliases.map(alias =>
      firestore().collection('presence').doc(alias).onSnapshot(
        doc => {
          const data = doc.data();
          setPresence(prev => ({
            ...prev,
            [alias]: {
              online: !!data?.online,
              lastActive: data?.lastActive || null,
            },
          }));
        },
        () => {},
      )
    );

    return () => unsubs.forEach(u => u());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(aliases)]);
}
