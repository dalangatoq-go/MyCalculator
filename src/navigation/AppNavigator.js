import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import CalculatorScreen from '../screens/CalculatorScreen';
import DashboardScreen  from '../screens/DashboardScreen';
import ChatRoomScreen   from '../screens/ChatRoomScreen';
import GalleryScreen    from '../screens/GalleryScreen';
import InfoAppScreen    from '../screens/InfoAppScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isUIAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isUIAuthenticated ? (
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ChatRoom"  component={ChatRoomScreen}  />
          <Stack.Screen name="Gallery"   component={GalleryScreen}   />
          <Stack.Screen name="InfoApp"   component={InfoAppScreen}   />
        </>
      )}
    </Stack.Navigator>
  );
}
