import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useEffect, useState } from 'react';

export const useFirestore = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'general_chat'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);
  return messages;
};
