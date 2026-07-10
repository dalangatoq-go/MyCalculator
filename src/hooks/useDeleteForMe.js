import { useCallback, useEffect, useState } from 'react';
import database from '@react-native-firebase/database';

/**
 * "Hapus untuk saya" — hanya menyembunyikan pesan di device sendiri.
 * Pesan asli TIDAK disentuh di Firestore; hanya menulis flag boolean ke
 * RTDB: deleted_for_me/{myAlias}/{messageId} = true. Kontak lain tetap
 * melihat pesan itu seperti biasa.
 */
export function useDeleteForMe(myAlias) {
  const [hiddenIds, setHiddenIds] = useState({});

  useEffect(() => {
    if (!myAlias) return undefined;

    const ref = database().ref(`deleted_for_me/${myAlias}`);
    const cb = (snapshot) => setHiddenIds(snapshot.val() || {});
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [myAlias]);

  const hideForMe = useCallback(
    (messageId) => {
      if (!myAlias || !messageId) return;
      database().ref(`deleted_for_me/${myAlias}/${messageId}`).set(true).catch(() => {});
    },
    [myAlias],
  );

  return { hiddenIds, hideForMe };
}
