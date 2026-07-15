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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import PlayerAvatar from '../components/PlayerAvatar';
import AvatarSelector from '../components/AvatarSelector';
import { COLORS } from '../constants/theme';
import RulesScreen from './RulesScreen';

export default function HomeScreen() {
  const {
    myId,
    connectSocket,
    createRoom,
    joinRoom,
    setPlayerName,
    setPlayerAvatar,
    playerAvatar,
    showToast,
  } = useGameStore();

  const [inputName, setInputName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: 'CREATE' | 'JOIN'; code?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'HOME' | 'SHADOWS' | 'MESSAGES' | 'SETTINGS'>('HOME');
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [avatarSelectorVisible, setAvatarSelectorVisible] = useState(false);

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
    connectSocket(customServerUrl.trim() || undefined);
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
    connectSocket(customServerUrl.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.gameTitle}>MAFIA</Text>
        </View>

        {/* HOME View */}
        {activeTab === 'HOME' && (
          <Card style={styles.profileCard}>
            <Text style={styles.sectionLabel}>PLAYER PROFILE</Text>

            {/* Tappable Avatar */}
            <TouchableOpacity
              style={styles.avatarTouchable}
              onPress={() => setAvatarSelectorVisible(true)}
              activeOpacity={0.7}
            >
              <PlayerAvatar
                avatar={playerAvatar}
                size={72}
                borderRadius={36}
                isHighlighted={!!playerAvatar}
                serverUrl={customServerUrl.trim() || undefined}
              />
              <View style={styles.avatarEditBadge}>
                <Ionicons name="pencil" size={10} color={COLORS.white} />
              </View>
            </TouchableOpacity>

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
        )}

        {/* Avatar Selector Modal */}
        <AvatarSelector
          visible={avatarSelectorVisible}
          onClose={() => setAvatarSelectorVisible(false)}
          onSelect={(avatar) => setPlayerAvatar(avatar)}
          selectedAvatar={playerAvatar}
          serverUrl={customServerUrl.trim() || undefined}
        />

        {/* SHADOWS (Rules) View */}
        {activeTab === 'SHADOWS' && (
          <RulesScreen onBackToHome={() => setActiveTab('HOME')} />
        )}

        {/* MESSAGES View */}
        {activeTab === 'MESSAGES' && (
          <Card style={styles.profileCard}>
            <Text style={styles.sectionLabel}>COMMUNICATIONS</Text>
            
            <View style={styles.comingSoonBody}>
              <View style={styles.lockedIconWrapper}>
                <Ionicons name="chatbubbles-outline" size={48} color={COLORS.gold} />
              </View>
              <Text style={styles.comingSoonTitle}>MESSAGING SYSTEM</Text>
              <Text style={styles.comingSoonDescription}>
                A secure real-time messaging system and private channels for the Mafia conspiracy are currently locked and in development.
              </Text>
              <View style={styles.featureSoonBadge}>
                <Text style={styles.featureSoonText}>COMING SOON</Text>
              </View>
            </View>
          </Card>
        )}

        {/* SETTINGS View */}
        {activeTab === 'SETTINGS' && (
          <Card style={styles.profileCard}>
            <Text style={styles.sectionLabel}>SETTINGS</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>SERVER CONNECTION</Text>
              <TextInput
                style={styles.settingInput}
                value={customServerUrl}
                onChangeText={setCustomServerUrl}
                placeholder="http://localhost:3000"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                textAlign="center"
              />
              <Text style={styles.settingSubtext}>
                Configure a custom IP/port to connect to a server hosted on your local network.
              </Text>
            </View>

            <View style={styles.cardDivider} />

            <Button
              title="SAVE CONFIGURATION"
              onPress={() => {
                showToast('Server connection configuration saved');
                setActiveTab('HOME');
              }}
              variant="outline"
              style={styles.actionBtnFull}
              textStyle={styles.actionBtnFullText}
              icon={<Ionicons name="save-outline" size={14} color={COLORS.white} />}
            />
          </Card>
        )}

        {pendingAction && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={styles.loadingText}>Connecting to game server...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('HOME')}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={20} color={activeTab === 'HOME' ? COLORS.gold : COLORS.navIconInactive} />
          <Text style={[styles.navText, activeTab === 'HOME' && styles.activeNavText]}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('SHADOWS')}
          activeOpacity={0.7}
        >
          <Ionicons name="shield" size={20} color={activeTab === 'SHADOWS' ? COLORS.gold : COLORS.navIconInactive} />
          <Text style={[styles.navText, activeTab === 'SHADOWS' && styles.activeNavText]}>SHADOWS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('MESSAGES')}
          activeOpacity={0.7}
        >
          <Ionicons name="mail" size={20} color={activeTab === 'MESSAGES' ? COLORS.gold : COLORS.navIconInactive} />
          <Text style={[styles.navText, activeTab === 'MESSAGES' && styles.activeNavText]}>MESSAGES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('SETTINGS')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings" size={20} color={activeTab === 'SETTINGS' ? COLORS.gold : COLORS.navIconInactive} />
          <Text style={[styles.navText, activeTab === 'SETTINGS' && styles.activeNavText]}>SETTINGS</Text>
        </TouchableOpacity>
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
  avatarTouchable: {
    alignSelf: 'center',
    marginBottom: 4,
    marginTop: 8,
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.goldTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 12,
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
  comingSoonBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  lockedIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  comingSoonTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12.5,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  featureSoonBadge: {
    backgroundColor: 'rgba(232, 192, 106, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.goldTranslucent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureSoonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  settingItem: {
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  settingInput: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 1,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
      default: {},
    }),
  },
  settingSubtext: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.5,
    marginTop: 10,
    paddingHorizontal: 8,
  },
});
