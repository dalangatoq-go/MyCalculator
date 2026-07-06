import firestore from '@react-native-firebase/firestore';
import { useEffect, useRef, useState } from 'react';

export const useFirestore = () => {
  const [messages, setMessages] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const unsubscribe = firestore()
      .collection('general_chat')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot(
        snapshot => {
          if (!isMounted.current) return;
          const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(msgs);
        },
        err => console.error('[useFirestore] error:', err?.message),
      );

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  return Array.isArray(messages) ? messages : [];
};
