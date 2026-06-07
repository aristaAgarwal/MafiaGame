import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';

export default function HomeScreen() {
  const {
    myId,
    connectSocket,
    createRoom,
    joinRoom,
    setPlayerName,
    showToast,
  } = useGameStore();

  const getDefaultUrl = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return `http://${window.location.hostname}:3000`;
    }
    return 'http://localhost:3000';
  };

  const [inputName, setInputName] = useState('');
  const [inputUrl, setInputUrl] = useState(getDefaultUrl());
  const [inputCode, setInputCode] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: 'CREATE' | 'JOIN'; code?: string } | null>(null);

  // Handle lazy socket connection & emissions
  useEffect(() => {
    if (myId && pendingAction) {
      if (pendingAction.type === 'CREATE') {
        createRoom();
      } else if (pendingAction.type === 'JOIN' && pendingAction.code) {
        joinRoom(pendingAction.code);
      }
      setPendingAction(null);
    }
  }, [myId, pendingAction]);

  const handleCreate = () => {
    let name = inputName.trim();
    if (!name) {
      name = `Player_${Math.floor(100 + Math.random() * 900)}`;
      setInputName(name);
      showToast(`Auto-assigned name: ${name}`);
    }
    setPlayerName(name);
    setPendingAction({ type: 'CREATE' });
    connectSocket(inputUrl.trim());
  };

  const handleJoin = () => {
    let name = inputName.trim();
    if (!name) {
      name = `Player_${Math.floor(100 + Math.random() * 900)}`;
      setInputName(name);
      showToast(`Auto-assigned name: ${name}`);
    }
    if (!inputCode.trim() || inputCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit room code.');
      return;
    }
    setPlayerName(name);
    setPendingAction({ type: 'JOIN', code: inputCode.trim() });
    connectSocket(inputUrl.trim());
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.gameTitle}>MAFIA</Text>
        </View>

        {/* Player Profile Card */}
        <Card style={styles.profileCard}>
          <Text style={styles.sectionLabel}>PLAYER PROFILE</Text>

          <TextInput
            style={styles.playerNameInput}
            value={inputName}
            onChangeText={setInputName}
            placeholder="Enter Name"
            placeholderTextColor={COLORS.whiteTranslucent}
            maxLength={15}
            autoCapitalize="characters"
            textAlign="center"
          />
          <Text style={styles.playerSubtitle}>LEVEL 14 | OMERTA SOCIETY</Text>

          <View style={styles.cardDivider} />

          {/* Input Fields */}

          <Button
            title="CREATE ROOM"
            onPress={handleCreate}
            variant="outline"
            style={styles.actionBtnFull}
            textStyle={styles.actionBtnFullText}
            icon={<Ionicons name="add-circle-outline" size={14} color={COLORS.white} />}
          />

          {/* OR Divider with Faded Lines */}
          <View style={styles.orDividerContainer}>
            <LinearGradient
              colors={['transparent', COLORS.whiteTranslucent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.orLine}
            />
            <Text style={styles.orText}>-or-</Text>
            <LinearGradient
              colors={[COLORS.whiteTranslucent, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.orLine}
            />
          </View>

          <Input
            label="ENTER ROOM CODE"
            placeholder="e.g. 1234"
            value={inputCode}
            onChangeText={setInputCode}
            keyboardType="number-pad"
            maxLength={4}
          />

          <Button
            title="JOIN ROOM"
            onPress={handleJoin}
            variant="outline"
            disabled={inputCode.trim().length !== 4}
            style={styles.actionBtnFull}
            textStyle={styles.actionBtnFullText}
            icon={
              <Ionicons
                name="enter-outline"
                size={14}
                color={inputCode.trim().length === 4 ? COLORS.white : COLORS.whiteTranslucent}
              />
            }
          />
        </Card>

        {pendingAction && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={styles.loadingText}>Connecting to game server...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={20} color={COLORS.gold} />
          <Text style={[styles.navText, styles.activeNavText]}>HOME</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="shield" size={20} color={COLORS.navIconInactive} />
          <Text style={styles.navText}>SHADOWS</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="mail" size={20} color={COLORS.navIconInactive} />
          <Text style={styles.navText}>MESSAGES</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="settings" size={20} color={COLORS.navIconInactive} />
          <Text style={styles.navText}>SETTINGS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 120, // Spacer for bottom nav
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
  gameTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 48,
    color: COLORS.textPrimary,
    letterSpacing: 8,
    textShadowColor: COLORS.titleShadow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    zIndex: 2,
  },
  profileCard: {
    width: '100%',
    maxWidth: 342,
    marginTop: 60,
  },
  sectionLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 17,
    color: COLORS.gold,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 6,
  },
  goldLine: {
    width: 120,
    height: 1,
    backgroundColor: COLORS.gold,
    alignSelf: 'center',
    marginBottom: 16,
  },
  playerNameInput: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 30,
    color: COLORS.white,
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 4,
    width: '100%',
    paddingVertical: 4,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
      default: {},
    }),
  },
  playerSubtitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionBtnFull: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    borderColor: COLORS.cardBorder,
    borderWidth: 2.5,
  },
  actionBtnFullText: {
    fontSize: 12,
    letterSpacing: 1.5,
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.cardDivider,
    marginBottom: 20,
  },
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.white,
    fontSize: 10,
    marginHorizontal: 16,
    letterSpacing: 2,
  },
  loadingOverlay: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.gold,
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: COLORS.bottomNavBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.bottomNavBorder,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.navIconInactive,
    marginTop: 4,
    letterSpacing: 1.5,
  },
  activeNavText: {
    color: COLORS.gold,
  },
});
