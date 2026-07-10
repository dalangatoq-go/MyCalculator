import { useEffect, useRef, useCallback, useState } from 'react';
import database from '@react-native-firebase/database';

const TYPING_CLEAR_MS = 4000;

/**
 * Mengirim status mengetik ke Realtime Database: typing/{roomId}/{alias}.
 * Node = true berarti sedang mengetik. Node dihapus saat berhenti mengetik,
 * kirim pesan, keluar chat, atau (jaring pengaman) koneksi putus.
 * Returns: setTyping(bool)
 */
export function useSendTyping(roomId, alias) {
  const clearTimer = useRef(null);
  const isTyping    = useRef(false);

  const getRef = useCallback(
    () => (roomId && alias ? database().ref(`typing/${roomId}/${alias}`) : null),
    [roomId, alias],
  );

  const clearTyping = useCallback(() => {
    const ref = getRef();
    if (!ref) return;
    isTyping.current = false;
    ref.onDisconnect().cancel().catch(() => {});
    ref.remove().catch(() => {});
  }, [getRef]);

  const setTyping = useCallback(
    (typing) => {
      const ref = getRef();
      if (!ref) return;

      if (typing) {
        if (!isTyping.current) {
          isTyping.current = true;
          // Jaring pengaman: kalau koneksi putus saat sedang mengetik
          // (crash, app dibunuh paksa), node ikut terhapus otomatis.
          ref.onDisconnect().remove().catch(() => {});
          ref.set(true).catch(() => {});
        }
        clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(clearTyping, TYPING_CLEAR_MS);
      } else {
        clearTimeout(clearTimer.current);
        clearTyping();
      }
    },
    [getRef, clearTyping],
  );

  useEffect(() => {
    return () => {
      clearTimeout(clearTimer.current);
      if (isTyping.current) clearTyping();
    };
  }, [clearTyping]);

  return setTyping;
}

/**
 * Berlangganan status mengetik di sebuah ruang (typing/{roomId}).
 * Returns: array alias yang sedang mengetik (kecuali diri sendiri).
 */
export function useTypingIndicator(roomId, myAlias) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!roomId) return undefined;

    const ref = database().ref(`typing/${roomId}`);
    const my  = (myAlias || '').toLowerCase();

    const cb = (snapshot) => {
      const data = snapshot.val() || {};
      const active = Object.keys(data).filter(
        (alias) => alias !== my && data[alias] === true,
      );
      setTypingUsers(active);
    };

    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [roomId, myAlias]);

  return typingUsers;
}
