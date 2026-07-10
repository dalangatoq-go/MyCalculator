import { useEffect, useRef, useCallback, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const TYPING_CLEAR_MS = 4000;
const TYPING_STALE_MS = 6000;

/**
 * Mengirim status mengetik ke Firestore koleksi typing/{roomId}.
 * Returns: setTyping(bool)
 */
export function useSendTyping(roomId, alias) {
  const clearTimer = useRef(null);
  const isTyping   = useRef(false);

  const clearTyping = useCallback(() => {
    if (!roomId || !alias) return;
    isTyping.current = false;
    firestore()
      .collection('typing')
      .doc(roomId)
      .update({ [alias]: firestore.FieldValue.delete() })
      .catch(() => {});
  }, [roomId, alias]);

  const setTyping = useCallback(
    (typing) => {
      if (!roomId || !alias) return;
      if (typing) {
        if (!isTyping.current) {
          isTyping.current = true;
          firestore()
            .collection('typing')
            .doc(roomId)
            .set(
              { [alias]: firestore.FieldValue.serverTimestamp() },
              { merge: true },
            )
            .catch(() => {});
        }
        clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(clearTyping, TYPING_CLEAR_MS);
      } else {
        clearTimeout(clearTimer.current);
        clearTyping();
      }
    },
    [roomId, alias, clearTyping],
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
 * Berlangganan status mengetik di sebuah ruang.
 * Returns: array alias yang sedang mengetik (kecuali diri sendiri).
 */
export function useTypingIndicator(roomId, myAlias) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!roomId) return undefined;
    const unsub = firestore()
      .collection('typing')
      .doc(roomId)
      .onSnapshot(
        (doc) => {
          const data = doc.data() || {};
          const now  = Date.now();
          const active = Object.entries(data)
            .filter(([alias, ts]) => {
              if (alias === (myAlias || '').toLowerCase()) return false;
              const ms = ts?.toMillis ? ts.toMillis() : 0;
              return now - ms < TYPING_STALE_MS;
            })
            .map(([alias]) => alias);
          setTypingUsers(active);
        },
        () => setTypingUsers([]),
      );
    return unsub;
  }, [roomId, myAlias]);

  return typingUsers;
}
