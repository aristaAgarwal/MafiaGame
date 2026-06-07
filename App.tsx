import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { useGameStore } from './src/store/gameStore';
import { COLORS } from './src/constants/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import NightScreen from './src/screens/NightScreen';
import DayScreen from './src/screens/DayScreen';
import VotingScreen from './src/screens/VotingScreen';
import EndScreen from './src/screens/EndScreen';

// Components
import Toast from './src/components/Toast';

export default function App() {
  const phase = useGameStore((state) => state.phase);

  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={COLORS.gold} />
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch (phase) {
      case 'LOBBY':
        return <LobbyScreen />;
      case 'NIGHT':
        return <NightScreen />;
      case 'DAY':
        return <DayScreen />;
      case 'VOTING':
        return <VotingScreen />;
      case 'END':
        return <EndScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('./assets/bg.png')}
        style={styles.backgroundImage}
        blurRadius={6}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderContent()}
        </KeyboardAvoidingView>
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
