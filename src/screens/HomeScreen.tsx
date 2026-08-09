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
  TouchableWithoutFeedback,
  Linking,
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
import { DEFAULT_SERVER_URL } from '../constants/config';
import RulesScreen from './RulesScreen';
import { configureGoogleSignIn, executeGoogleSignIn } from '../utils/googleAuth';

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const CustomToggle = ({ value, onValueChange }: ToggleProps) => (
  <TouchableOpacity
    style={[
      styles.customToggleTrack,
      value ? styles.customToggleTrackActive : styles.customToggleTrackInactive
    ]}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.8}
  >
    <View style={[
      styles.customToggleThumb,
      value ? styles.customToggleThumbActive : styles.customToggleThumbInactive
    ]} />
  </TouchableOpacity>
);


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
    googleUser,
    gameHistory,
    gameStats,
    signInWithGoogle,
    signOutGoogle,
    generalSettings,
    updateGeneralSettings,
  } = useGameStore();

  const [inputName, setInputName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: 'CREATE' | 'JOIN'; code?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'HOME' | 'SHADOWS' | 'HISTORY' | 'SETTINGS'>('HOME');
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [avatarSelectorVisible, setAvatarSelectorVisible] = useState(false);
  const [historyViewMode, setHistoryViewMode] = useState<'LOGS' | 'ANALYTICS'>('LOGS');

  // Sync Google user with name input and fetch initial details
  useEffect(() => {
    if (googleUser) {
      setInputName(googleUser.name);
    }
  }, [googleUser]);

  useEffect(() => {
    configureGoogleSignIn();
    const currentName = useGameStore.getState().playerName;
    if (currentName) {
      setInputName(currentName);
    }
  }, []);

  const handleGoogleSignInReal = async () => {
    try {
      const user = await executeGoogleSignIn();
      await signInWithGoogle(user);
      showToast(`SIGNED IN AS ${user.name}`);
    } catch (e: any) {
      console.error(e);
      showToast(e.message || 'GOOGLE SIGN-IN FAILED');
    }
  };


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
        {activeTab !== 'SETTINGS' ? (
          <View style={styles.headerSection}>
            <Text style={styles.gameTitle}>MAFIA</Text>
          </View>
        ) : (
          <View style={styles.settingsHeaderSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoM}>M</Text>
              <View style={styles.logoDrip} />
            </View>
            <View style={styles.headerTitlesContainer}>
              <Text style={styles.mafiaTitle}>MAFIA</Text>
              <Text style={styles.subSettingsTitle}>GENERAL SETTINGS</Text>
            </View>
          </View>
        )}

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

        {/* HISTORY View */}
        {activeTab === 'HISTORY' && (
          <Card style={styles.historyCard}>
            <Text style={styles.sectionLabel}>PLAYER DOSSIER & STATS</Text>

            {/* Logs/Analytics Tabs */}
            <View style={styles.historyTabs}>
              <TouchableOpacity
                style={[styles.historyTabBtn, historyViewMode === 'LOGS' && styles.historyTabBtnActive]}
                onPress={() => setHistoryViewMode('LOGS')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="list-outline"
                  size={14}
                  color={historyViewMode === 'LOGS' ? COLORS.black : COLORS.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.historyTabBtnText, historyViewMode === 'LOGS' && styles.historyTabBtnTextActive]}>
                  LOGS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.historyTabBtn, historyViewMode === 'ANALYTICS' && styles.historyTabBtnActive]}
                onPress={() => setHistoryViewMode('ANALYTICS')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="stats-chart-outline"
                  size={14}
                  color={historyViewMode === 'ANALYTICS' ? COLORS.black : COLORS.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.historyTabBtnText, historyViewMode === 'ANALYTICS' && styles.historyTabBtnTextActive]}>
                  ANALYTICS
                </Text>
              </TouchableOpacity>
            </View>

            {historyViewMode === 'LOGS' ? (
              <View style={styles.historyContainer}>
                {gameHistory.length === 0 ? (
                  <View style={styles.comingSoonBody}>
                    <View style={styles.lockedIconWrapper}>
                      <Ionicons name="folder-open-outline" size={44} color={COLORS.gold} />
                    </View>
                    <Text style={styles.comingSoonTitle}>NO DOSSIER ON FILE</Text>
                    <Text style={styles.comingSoonDescription}>
                      Play multiplayer Mafia games to build up your criminal record and log wins, losses, and role statistics.
                    </Text>
                  </View>
                ) : (
                  gameHistory.map((game) => (
                    <View key={game.id} style={styles.historyRow}>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyDate}>
                          {new Date(game.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <Text style={styles.historyRoom}>ROOM: {game.room_code}</Text>
                        <Text style={styles.historyDetails}>
                          {game.total_players} players • Round {game.round_reached}
                        </Text>
                      </View>
                      <View style={styles.historyStatus}>
                        <View style={styles.historyMetaRow}>
                          <Text
                            style={[
                              styles.historyRoleLabel,
                              {
                                color:
                                  game.role === 'MAFIA'
                                    ? COLORS.mafia
                                    : game.role === 'POLICE'
                                    ? COLORS.police
                                    : game.role === 'DOCTOR'
                                    ? COLORS.doctor
                                    : COLORS.villager,
                              },
                            ]}
                          >
                            {game.role}
                          </Text>
                          <Text style={game.is_alive ? styles.aliveTag : styles.deadTag}>
                            {game.is_alive ? 'ALIVE' : 'DEAD'}
                          </Text>
                        </View>
                        <Text style={game.result === 'WIN' ? styles.winBadge : styles.lossBadge}>
                          {game.result === 'WIN' ? 'VICTORY' : 'DEFEAT'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View style={styles.analyticsContainer}>
                {!gameStats || gameStats.totalGames === 0 ? (
                  <View style={styles.comingSoonBody}>
                    <View style={styles.lockedIconWrapper}>
                      <Ionicons name="analytics-outline" size={44} color={COLORS.gold} />
                    </View>
                    <Text style={styles.comingSoonTitle}>INSUFFICIENT DATA</Text>
                    <Text style={styles.comingSoonDescription}>
                      Complete at least one game session to generate performance analytics and charts.
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Win Rate Ring */}
                    <View style={styles.winRateRingContainer}>
                      <View style={styles.glowingRingOuter}>
                        <View style={styles.glowingRingInner}>
                          <Text style={styles.winPercentageText}>{gameStats.winRate}%</Text>
                          <Text style={styles.winPercentageLabel}>WIN RATE</Text>
                        </View>
                      </View>
                      <Text style={styles.overallGamesText}>
                        {gameStats.totalWins} WINS / {gameStats.totalGames} GAMES
                      </Text>
                    </View>

                    {/* Role Distribution Bar Chart */}
                    <View style={styles.chartSection}>
                      <Text style={styles.chartTitle}>ROLE FREQUENCY</Text>
                      {Object.keys(gameStats.roleStats).map((role) => {
                        const count = gameStats.roleStats[role].games;
                        const ratio = gameStats.totalGames > 0 ? count / gameStats.totalGames : 0;
                        const percentage = Math.round(ratio * 100);
                        const roleColor =
                          role === 'MAFIA'
                            ? COLORS.mafia
                            : role === 'POLICE'
                            ? COLORS.police
                            : role === 'DOCTOR'
                            ? COLORS.doctor
                            : COLORS.villager;

                        return (
                          <View key={role} style={styles.barChartRow}>
                            <View style={styles.barChartLabelRow}>
                              <Text style={[styles.barChartRoleLabel, { color: roleColor }]}>{role}</Text>
                              <Text style={styles.barChartCountText}>{count} Games</Text>
                            </View>
                            <View style={styles.barTrack}>
                              <View
                                style={[
                                  styles.barFill,
                                  {
                                    width: `${Math.max(5, percentage)}%`,
                                    backgroundColor: roleColor,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {/* Role Win Rates Grid */}
                    <View style={styles.chartSection}>
                      <Text style={styles.chartTitle}>ROLE PERFORMANCE</Text>
                      <View style={styles.statsGrid}>
                        {Object.keys(gameStats.roleStats).map((role) => {
                          const rStat = gameStats.roleStats[role];
                          const roleColor =
                            role === 'MAFIA'
                              ? COLORS.mafia
                              : role === 'POLICE'
                              ? COLORS.police
                              : role === 'DOCTOR'
                              ? COLORS.doctor
                              : COLORS.villager;

                          return (
                            <View key={role} style={styles.statsGridCard}>
                              <Text style={[styles.gridRoleTitle, { color: roleColor }]}>{role}</Text>
                              <Text style={styles.gridRateText}>{rStat.winRate}% WIN RATE</Text>
                              <Text style={styles.gridRatioText}>
                                {rStat.wins}W - {rStat.games - rStat.wins}L
                              </Text>
                              <View style={styles.gridBarTrack}>
                                <View
                                  style={[
                                    styles.gridBarFill,
                                    {
                                      width: `${rStat.winRate}%`,
                                      backgroundColor: roleColor,
                                    },
                                  ]}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}
          </Card>
        )}


        {/* SETTINGS View */}
        {activeTab === 'SETTINGS' && (
          <View style={styles.settingsViewContainer}>
            {/* PROFILE Card */}
            <View style={styles.generalSettingsCard}>
              <View style={styles.settingsCardInner}>
                <View style={styles.settingsLeftIcon}>
                  <View style={styles.redAvatarFrame}>
                    <PlayerAvatar
                      avatar={playerAvatar}
                      size={64}
                      borderRadius={32}
                      isHighlighted={true}
                      serverUrl={customServerUrl.trim() || undefined}
                    />
                  </View>
                </View>
                <View style={styles.settingsRightContent}>
                  <View style={styles.settingsCardHeaderRow}>
                    <Text style={styles.settingsCardTitle}>Profile</Text>
                    <TouchableOpacity
                      style={styles.settingsEditBtn}
                      onPress={() => setAvatarSelectorVisible(true)}
                    >
                      <Text style={styles.settingsEditBtnText}>EDIT</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.settingsCardSubtitle}>
                    Current User: {googleUser ? googleUser.name : (inputName || 'GUEST PLAYER')}
                  </Text>
                  
                  <View style={styles.googleSignInBar}>
                    <Text style={styles.googleSignInBarText}>
                      {googleUser ? 'You are signed in.' : 'Guest Account.'}
                    </Text>
                    {!googleUser ? (
                      <TouchableOpacity
                        style={styles.googleBarBtn}
                        onPress={handleGoogleSignInReal}
                      >
                        <Text style={styles.googleBarBtnText}>SIGN IN</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.googleBarBtn}
                        onPress={async () => {
                          await signOutGoogle();
                          showToast('Signed out of Google');
                        }}
                      >
                        <Text style={styles.googleBarBtnText}>SIGN OUT</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* NOTIFICATIONS Card */}
            <View style={styles.generalSettingsCard}>
              <View style={styles.settingsCardInner}>
                <View style={styles.settingsLeftIcon}>
                  <View style={styles.settingsIconBg}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.redBright} />
                  </View>
                </View>
                <View style={styles.settingsRightContent}>
                  <Text style={styles.settingsCardTitle}>Notifications</Text>
                  
                  <View style={styles.settingDetailRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingRowLabel}>Enable Game Alerts</Text>
                      <Text style={styles.settingRowSublabel}>allows Game Alerts to game play</Text>
                    </View>
                    <CustomToggle
                      value={generalSettings.gameAlerts}
                      onValueChange={(val) => updateGeneralSettings({ gameAlerts: val })}
                    />
                  </View>

                  <View style={styles.settingDetailRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingRowLabel}>Mafia Chat Notifications</Text>
                      <Text style={styles.settingRowSublabel}>allows Chat notifications' changes</Text>
                    </View>
                    <CustomToggle
                      value={generalSettings.chatAlerts}
                      onValueChange={(val) => updateGeneralSettings({ chatAlerts: val })}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* SOUND & HAPTICS Card */}
            <View style={styles.generalSettingsCard}>
              <View style={styles.settingsCardInner}>
                <View style={styles.settingsLeftIcon}>
                  <View style={styles.settingsIconBg}>
                    <Ionicons name="volume-medium-outline" size={24} color={COLORS.redBright} />
                  </View>
                </View>
                <View style={styles.settingsRightContent}>
                  <View style={styles.settingsCardHeaderRow}>
                    <Text style={styles.settingsCardTitle}>Sound & Haptics</Text>
                    <Text style={styles.settingsCardVolumeHeader}>Master Volume</Text>
                  </View>

                  {/* Volume Slider Track */}
                  <View style={styles.sliderTrackContainer}>
                    <View style={styles.sliderLine} />
                    <View style={styles.sliderPointsRow}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={styles.sliderPointTapTarget}
                          onPress={() => updateGeneralSettings({ volume: level })}
                          activeOpacity={0.8}
                        >
                          {generalSettings.volume === level ? (
                            <View style={styles.sliderKnobCircle}>
                              <Text style={styles.sliderKnobValue}>{level}</Text>
                            </View>
                          ) : (
                            <View style={styles.sliderPointDot} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  {/* Slider Labels */}
                  <View style={styles.sliderLabelsRow}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Text
                        key={level}
                        style={[
                          styles.sliderLabelText,
                          generalSettings.volume === level && styles.sliderLabelTextActive
                        ]}
                      >
                        {level}
                      </Text>
                    ))}
                  </View>

                  <View style={[styles.settingDetailRow, { marginTop: 12 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingRowLabel}>Haptic Feedback</Text>
                    </View>
                    <CustomToggle
                      value={generalSettings.haptic}
                      onValueChange={(val) => updateGeneralSettings({ haptic: val })}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* PRIVACY & SECURITY Card */}
            <View style={styles.generalSettingsCard}>
              <View style={styles.settingsCardInner}>
                <View style={styles.settingsLeftIcon}>
                  <View style={styles.settingsIconBg}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.redBright} />
                  </View>
                </View>
                <View style={styles.settingsRightContent}>
                  <Text style={styles.settingsCardTitle}>Privacy & Security</Text>
                  
                  <TouchableOpacity
                    style={styles.privacyActionBtn}
                    onPress={() => {
                      showToast(googleUser ? 'PASSWORD HANDLED BY GOOGLE SETTINGS' : 'PASSWORDS ARE DISABLED FOR GUEST MODE');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.privacyActionBtnText}>CHANGE PASSWORD</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.privacyLink}
                    onPress={async () => {
                      const serverUrl = customServerUrl.trim() || DEFAULT_SERVER_URL;
                      try {
                        await Linking.openURL(`${serverUrl}/privacy`);
                      } catch (err) {
                        showToast('FAILED TO OPEN PRIVACY POLICY');
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.privacyLinkText}>VIEW PRIVACY POLICY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* SERVER CONNECTION setting for custom servers */}
            <View style={styles.generalSettingsCard}>
              <View style={styles.settingsCardInner}>
                <View style={styles.settingsLeftIcon}>
                  <View style={styles.settingsIconBg}>
                    <Ionicons name="server-outline" size={24} color={COLORS.redBright} />
                  </View>
                </View>
                <View style={styles.settingsRightContent}>
                  <Text style={styles.settingsCardTitle}>Server Connection</Text>
                  <TextInput
                    style={styles.settingsServerInput}
                    value={customServerUrl}
                    onChangeText={setCustomServerUrl}
                    placeholder={DEFAULT_SERVER_URL}
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="none"
                  />
                  <Text style={styles.settingsServerSubtext}>
                    Configure a custom IP/port to connect to a local server.
                  </Text>
                </View>
              </View>
            </View>

            {/* Back Button */}
            <Button
              title="SAVE & BACK TO HOME"
              onPress={() => {
                showToast('Settings saved successfully');
                setActiveTab('HOME');
              }}
              variant="outline"
              style={styles.settingsBackBtn}
              textStyle={styles.settingsBackBtnText}
              icon={<Ionicons name="home-outline" size={14} color={COLORS.gold} />}
            />
          </View>
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
          onPress={() => setActiveTab('HISTORY')}
          activeOpacity={0.7}
        >
          <Ionicons name="stats-chart" size={20} color={activeTab === 'HISTORY' ? COLORS.gold : COLORS.navIconInactive} />
          <Text style={[styles.navText, activeTab === 'HISTORY' && styles.activeNavText]}>HISTORY</Text>
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
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: 6,
  },
  googleBadge: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 192, 106, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.goldTranslucent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  googleBadgeText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 7,
    color: COLORS.gold,
    marginLeft: 3,
    letterSpacing: 1,
  },
  googleAuthSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232, 192, 106, 0.08)',
    borderWidth: 1.5,
    borderColor: COLORS.goldTranslucent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  googleSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  googleSignOutText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  loadingOverlayFull: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 24,
  },
  modalBackdropClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: COLORS.gold,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  accountsScroll: {
    maxHeight: 200,
    width: '100%',
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 6,
    marginBottom: 8,
  },
  accountName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 1,
  },
  accountEmail: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  customSimForm: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    width: '100%',
  },
  customFormLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  customFormInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.white,
    marginBottom: 10,
    letterSpacing: 0.5,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  historyCard: {
    width: '100%',
    maxWidth: 342,
    marginTop: 30,
    minHeight: 400,
  },
  historyTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
    width: '100%',
  },
  historyTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: 'transparent',
    flex: 1,
  },
  historyTabBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  historyTabBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  historyTabBtnTextActive: {
    color: COLORS.black,
  },
  historyContainer: {
    width: '100%',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  historyRoom: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.gold,
    letterSpacing: 1,
    marginTop: 2,
  },
  historyDetails: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  historyStatus: {
    alignItems: 'flex-end',
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  historyRoleLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  aliveTag: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 7,
    color: COLORS.doctor,
    borderColor: COLORS.goldTranslucent,
    borderWidth: 0.5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    letterSpacing: 0.5,
  },
  deadTag: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 7,
    color: COLORS.mafia,
    borderColor: 'rgba(255, 74, 74, 0.3)',
    borderWidth: 0.5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    letterSpacing: 0.5,
  },
  winBadge: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 8,
    color: '#2ECC71',
    letterSpacing: 1,
  },
  lossBadge: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 8,
    color: COLORS.redBright,
    letterSpacing: 1,
  },
  analyticsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  winRateRingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  glowingRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232, 192, 106, 0.03)',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  glowingRingInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winPercentageText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 26,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  winPercentageLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  overallGamesText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
    marginTop: 12,
  },
  chartSection: {
    width: '100%',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  chartTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  barChartRow: {
    marginBottom: 14,
    width: '100%',
  },
  barChartLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barChartRoleLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  barChartCountText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  statsGridCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  gridRoleTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
  },
  gridRateText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  gridRatioText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  gridBarTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1.5,
    width: '100%',
    overflow: 'hidden',
  },
  gridBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  googleStatusContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 8,
  },
  googleUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  googleUserEmail: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  googleUserStatus: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.gold,
    letterSpacing: 1,
    marginTop: 2,
  },
  // SETTINGS SPECIFIC STYLES
  settingsHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  logoContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  logoM: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 40,
    color: '#8B2020',
    textShadowColor: 'rgba(255, 74, 74, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoDrip: {
    position: 'absolute',
    bottom: 2,
    width: 2,
    height: 6,
    backgroundColor: '#8B2020',
    left: 23,
    borderRadius: 1,
  },
  headerTitlesContainer: {
    alignItems: 'flex-start',
  },
  mafiaTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: 3,
  },
  subSettingsTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginTop: -2,
  },
  settingsViewContainer: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    gap: 16,
    marginBottom: 40,
  },
  generalSettingsCard: {
    width: '100%',
    backgroundColor: 'rgba(20, 15, 15, 0.85)',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.cardBorder,
    padding: 16,
    shadowColor: '#8B2020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  settingsCardInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  settingsLeftIcon: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  settingsRightContent: {
    flex: 1,
    paddingLeft: 4,
    justifyContent: 'center',
  },
  redAvatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#8B2020',
    padding: 2,
    backgroundColor: '#1E1212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 32, 32, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 32, 32, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  settingsCardTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 1,
  },
  settingsCardSubtitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  settingsCardVolumeHeader: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  settingsEditBtn: {
    borderWidth: 1,
    borderColor: 'rgba(139, 32, 32, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  settingsEditBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 1,
  },
  googleSignInBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(139, 32, 32, 0.15)',
    marginTop: 4,
  },
  googleSignInBarText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  googleBarBtn: {
    backgroundColor: '#8B2020',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#8B2020',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  googleBarBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  settingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  settingRowLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  settingRowSublabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  // Custom switch implementation styles
  customToggleTrack: {
    width: 44,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
  },
  customToggleTrackActive: {
    backgroundColor: '#8B2020',
    borderWidth: 0.5,
    borderColor: 'rgba(232, 192, 106, 0.3)',
  },
  customToggleTrackInactive: {
    backgroundColor: '#1E1212',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 32, 32, 0.3)',
  },
  customToggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  customToggleThumbActive: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  customToggleThumbInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-start',
  },
  // Volume slider elements
  sliderTrackContainer: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  sliderLine: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    height: 4,
    backgroundColor: '#1C1212',
    borderWidth: 1,
    borderColor: '#4A2A2A',
    borderRadius: 2,
  },
  sliderPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
    width: '100%',
  },
  sliderPointTapTarget: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderPointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A2A2A',
  },
  sliderKnobCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#8B2020',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B2020',
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderKnobValue: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.white,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    width: '100%',
  },
  sliderLabelText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 9,
    color: COLORS.textMuted,
    width: 16,
    textAlign: 'center',
  },
  sliderLabelTextActive: {
    color: COLORS.gold,
    fontFamily: 'Cinzel_700Bold',
  },
  // Privacy Action styling
  privacyActionBtn: {
    borderWidth: 1,
    borderColor: 'rgba(139, 32, 32, 0.6)',
    borderRadius: 6,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 32, 32, 0.05)',
    marginVertical: 12,
  },
  privacyActionBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  privacyLink: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  privacyLinkText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  // Server connection specific inputs
  settingsServerInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(139, 32, 32, 0.3)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.white,
    marginVertical: 10,
    letterSpacing: 0.5,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  settingsServerSubtext: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  // Save Back Button
  settingsBackBtn: {
    width: '100%',
    borderColor: COLORS.gold,
    borderWidth: 1,
    backgroundColor: 'rgba(232, 192, 106, 0.04)',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  settingsBackBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
});
