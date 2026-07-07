import React, { useEffect } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { OneSignalService } from './src/utils/oneSignalService';

OneSignalService.initialize();

function AppContent() {
  const { isLoadingSession } = React.useContext(AuthContext);

  useEffect(() => {
    const unsub = OneSignalService.addForegroundNotificationListener((event) => {
      const title = event.notification.title || 'MyCalculator Pro';
      const body  = event.notification.body  || 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.';
      event.preventDefault();
      Alert.alert(title, body, [{ text: 'OK' }]);
    });
    return unsub;
  }, []);

  if (isLoadingSession) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#333" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
