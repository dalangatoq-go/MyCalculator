import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { OneSignalService } from './src/utils/oneSignalService';

OneSignalService.initialize();

function AppContent() {
  const { isLoadingSession } = React.useContext(AuthContext);

  // Popup Alert di tengah layar saat notifikasi masuk ketika app terbuka
  // (foreground) sudah dihapus sesuai permintaan. OneSignal SDK akan
  // menampilkan notifikasi sistem secara normal (banner), bukan popup
  // in-app, tanpa perlu listener/handler khusus di sini.

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
