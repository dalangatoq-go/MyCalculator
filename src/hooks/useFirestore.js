import firestore from '@react-native-firebase/firestore';
import { useEffect, useRef, useState } from 'react';

export const useFirestore = () => {
  const [messages, setMessages] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    let unsubscribe;
    try {
      unsubscribe = firestore()
        .collection('general_chat')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          snapshot => {
            try {
              const msgs = snapshot.docs.map(doc => {
                const data = doc.data() || {};
                return { id: doc.id, ...data };
              });
              if (isMounted.current) {
                setMessages(msgs);
              }
            } catch (mapError) {
              console.error('[useFirestore] Error mapping snapshot docs:', mapError);
            }
          },
          error => {
            console.error('[useFirestore] onSnapshot error:', error);
          }
        );
    } catch (initError) {
      console.error('[useFirestore] Failed to init listener:', initError);
    }

    return () => {
      isMounted.current = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return Array.isArray(messages) ? messages : [];
};
