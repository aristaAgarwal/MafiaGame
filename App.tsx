import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { useGameStore } from './src/store/gameStore';
import { COLORS } from './src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import RoleRevealScreen from './src/screens/RoleRevealScreen';
import NightScreen from './src/screens/NightScreen';
import DayScreen from './src/screens/DayScreen';
import VotingScreen from './src/screens/VotingScreen';
import EndScreen from './src/screens/EndScreen';

// Components
import Toast from './src/components/Toast';
import Card from './src/components/Card';
import Button from './src/components/Button';

export default function App() {
  const phase = useGameStore((state) => state.phase);
  const leaveLobby = useGameStore((state) => state.leaveLobby);
  const isOffline = useGameStore((state) => state.isOffline);
  const isServerDown = useGameStore((state) => state.isServerDown);
  const isConnecting = useGameStore((state) => state.isConnecting);
  const lastConnectedUrl = useGameStore((state) => state.lastConnectedUrl);
  const reconnect = useGameStore((state) => state.reconnect);

  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
      case 'ROLE_REVEAL':
        return <RoleRevealScreen />;
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

  const getBgImage = () => {
    if (phase === 'HOME' || !phase) {
      return require('./assets/bg.png');
    }
    return require('./assets/lobby.png');
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={getBgImage()}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {phase !== 'HOME' && phase !== undefined && (
            <View style={styles.headerBar}>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.headerBackButton}
                  onPress={() => setShowExitConfirm(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MAFIA: CITY OF SHADOWS</Text>
              </View>
            </View>
          )}

          <View style={styles.mainContentContainer}>
            {renderContent()}
          </View>
        </KeyboardAvoidingView>

        {showExitConfirm && (
          <TouchableOpacity
            style={styles.confirmOverlay}
            activeOpacity={1}
            onPress={() => setShowExitConfirm(false)}
          >
            <TouchableWithoutFeedback>
              <View style={{ width: '85%', maxWidth: 300 }}>
                <Card style={{ width: '100%' }}>
                  <Text style={styles.confirmTitle}>EXIT GAME</Text>
                  <Text style={styles.confirmText}>Are you sure you want to exit the current game session?</Text>
                  <View style={styles.confirmButtons}>
                    <Button
                      title="CANCEL"
                      variant="outline"
                      onPress={() => setShowExitConfirm(false)}
                      style={styles.confirmBtn}
                    />
                    <Button
                      title="EXIT"
                      variant="primary"
                      onPress={() => {
                        setShowExitConfirm(false);
                        leaveLobby();
                      }}
                      style={styles.confirmBtn}
                    />
                  </View>
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        )}

        {/* Connection Error Overlay */}
        {(isOffline || isServerDown) && (
          <View style={styles.confirmOverlay}>
            <TouchableWithoutFeedback>
              <View style={{ width: '85%', maxWidth: 320 }}>
                <Card style={{ width: '100%' }}>
                  <View style={styles.errorIconContainer}>
                    <Ionicons 
                      name={isOffline ? "cloud-offline-outline" : "server-outline"} 
                      size={44} 
                      color={isOffline ? COLORS.redBright : COLORS.gold} 
                    />
                  </View>
                  <Text style={styles.confirmTitle}>
                    {isOffline ? 'NO INTERNET' : 'SERVER UNREACHABLE'}
                  </Text>
                  <Text style={styles.confirmText}>
                    {isOffline 
                      ? 'Please check your internet connection. We are trying to reconnect you to the Mafia network.' 
                      : `Could not connect to the game server at:\n${lastConnectedUrl || 'unknown'}\n\nPlease check if the server is running or configure settings.`}
                  </Text>

                  <View style={styles.errorButtonsContainer}>
                    {isOffline ? (
                      <>
                        <Button
                          title="SETTINGS"
                          variant="outline"
                          onPress={async () => {
                            try {
                              await Linking.openSettings();
                            } catch (err) {
                              console.error('Failed to open settings:', err);
                            }
                          }}
                          style={styles.errorBtn}
                        />
                        <Button
                          title={isConnecting ? "CONNECTING" : "RETRY"}
                          variant="primary"
                          loading={isConnecting}
                          onPress={reconnect}
                          style={styles.errorBtn}
                        />
                      </>
                    ) : (
                      <Button
                        title={isConnecting ? "CONNECTING" : "RETRY"}
                        variant="primary"
                        loading={isConnecting}
                        onPress={reconnect}
                        style={{ width: '100%' }}
                      />
                    )}
                  </View>

                  <Button
                    title="EXIT TO HOME"
                    variant="secondary"
                    onPress={leaveLobby}
                    style={styles.exitBtn}
                  />
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}

        <Toast />
      </ImageBackground>
    </View>
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
  headerBar: {
    height: Platform.OS === 'ios' ? 104 : 100,
    paddingTop: Platform.OS === 'ios' ? 44 : 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomNavBorder,
    backgroundColor: COLORS.bottomNavBg,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerBackButton: {
    position: 'absolute',
    left: 8,
    padding: 8,
    zIndex: 1000,
  },
  mainContentContainer: {
    flex: 1,
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmDialog: {
    width: '85%',
    maxWidth: 300,
    padding: 24,
    alignItems: 'center',
  },
  confirmTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  confirmText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  confirmBtn: {
    flex: 1,
  },
  errorIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  errorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 12,
  },
  errorBtn: {
    flex: 1,
  },
  exitBtn: {
    width: '100%',
  },
});
