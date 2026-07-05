import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import CalculatorScreen from '../screens/CalculatorScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
      ) : (
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ gestureEnabled: false }} />
      )}
    </Stack.Navigator>
  );
}
