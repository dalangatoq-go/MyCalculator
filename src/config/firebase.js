import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';

// Native SDK otomatis membaca google-services.json — tidak perlu initializeApp manual
export const db = firestore();
export const auth = firebaseAuth();
