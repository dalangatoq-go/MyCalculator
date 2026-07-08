import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import CalculatorScreen from '../screens/CalculatorScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Gunakan isUIAuthenticated (bukan isAuthenticated)
  // → app SELALU buka sebagai kalkulator, meski sesi tersimpan
  const { isUIAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isUIAuthenticated ? (
        // Belum ketik kode stealth sesi ini → tampilkan kalkulator
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
      ) : (
        // Sudah ketik kode stealth → masuk dashboard & chat
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
