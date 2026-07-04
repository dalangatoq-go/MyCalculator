import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Kita akan mengimpor layar yang akan dibuat pada tahap selanjutnya
import CalculatorScreen from './src/screens/CalculatorScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Calculator" 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0A0A0A' } 
        }}
      >
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen 
          name="ChatRoom" 
          component={ChatRoomScreen} 
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
