import firestore from '@react-native-firebase/firestore';
import { useEffect, useRef, useState } from 'react';

export const useFirestore = () => {
  const [messages, setMessages] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    console.log('[useFirestore] START — subscribing to general_chat');

    let unsubscribe;
    try {
      console.log('[useFirestore] Calling firestore().collection().orderBy().onSnapshot()');

      unsubscribe = firestore()
        .collection('general_chat')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          snapshot => {
            console.log('[useFirestore] onSnapshot FIRED — docs count:', snapshot?.docs?.length ?? 'null');
            try {
              const msgs = snapshot.docs.map((doc, index) => {
                console.log('[useFirestore] mapping doc[' + index + '] id:', doc.id);
                const data = doc.data() || {};
                console.log('[useFirestore] doc[' + index + '] fields — text:', data.text, '| userAlias:', data.userAlias, '| createdAt:', data.createdAt);
                return { id: doc.id, ...data };
              });
              console.log('[useFirestore] mapping DONE — total:', msgs.length);
              if (isMounted.current) {
                console.log('[useFirestore] setMessages called — isMounted=true');
                setMessages(msgs);
              } else {
                console.warn('[useFirestore] setMessages SKIPPED — isMounted=false (component unmounted)');
              }
            } catch (mapError) {
              console.error('[useFirestore] ERROR during mapping:', mapError?.message);
              console.error('[useFirestore] stack:', mapError?.stack);
            }
          },
          error => {
            console.error('[useFirestore] onSnapshot ERROR CALLBACK:');
            console.error('  code:', error?.code);
            console.error('  message:', error?.message);
            console.error('  stack:', error?.stack);
          }
        );

      console.log('[useFirestore] onSnapshot listener registered — typeof unsubscribe:', typeof unsubscribe);
    } catch (initError) {
      console.error('[useFirestore] INIT ERROR (before snapshot):', initError?.message);
      console.error('[useFirestore] stack:', initError?.stack);
    }

    return () => {
      console.log('[useFirestore] CLEANUP — isMounted=false, unsubscribing');
      isMounted.current = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
        console.log('[useFirestore] unsubscribe() called successfully');
      } else {
        console.warn('[useFirestore] unsubscribe is not a function — typeof:', typeof unsubscribe);
      }
    };
  }, []);

  return Array.isArray(messages) ? messages : [];
};
