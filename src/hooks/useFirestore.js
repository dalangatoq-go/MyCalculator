import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

export const useFirestore = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('general_chat')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    return unsubscribe;
  }, []);

  return messages;
};
