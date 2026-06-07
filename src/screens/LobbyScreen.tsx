import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LobbyScreen() {
  const {
    myId,
    roomCode,
    players,
    hostId,
    startGame,
    leaveLobby,
  } = useGameStore();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const minPlayers = 3;
  const canStart = playersList.length >= minPlayers;

  const handleInvite = async () => {
    try {
      await Share.share({
        message: `Join my Mafia: City of Shadows game lobby!\nRoom Code: ${roomCode}`,
      });
    } catch (error) {
      console.log('Error sharing room code:', error);
    }
  };

  const handleBackPress = () => {
    setShowExitConfirm(true);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Navigation Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={handleBackPress} 
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MAFIA: CITY OF SHADOWS</Text>
      </View>

      {/* Main Glassmorphic Lobby Card */}
      <Card style={styles.lobbyCard}>
        {/* Game Lobby Header */}
        <Text style={styles.lobbyTitle}>GAME LOBBY</Text>
        <Text style={styles.lobbyStatus}>
          STATUS: <Text style={styles.statusWaiting}>WAITING</Text> <Text style={styles.playerCount}>({playersList.length}/12 Players)</Text>
        </Text>
        <Text style={styles.roomCodeSub}>ROOM CODE: {roomCode}</Text>

        {/* Table Headers */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.columnHeader, styles.colUsername]}>USERNAME</Text>
          <Text style={[styles.columnHeader, styles.colRole]}>ROLE</Text>
          <Text style={[styles.columnHeader, styles.colStatus]}>STATUS</Text>
        </View>

        {/* Scrollable Player List inside the Card */}
        <ScrollView
          style={styles.playerListScroll}
          contentContainerStyle={styles.playerListContent}
          showsVerticalScrollIndicator={true}
        >
          {playersList.map((player) => {
            const isMe = player.id === myId;
            return (
              <View key={player.id} style={styles.playerRow}>
                {/* Avatar & Username */}
                <View style={[styles.colUsername, styles.playerNameContainer]}>
                  <View style={[styles.avatarWrapper, isMe && styles.meAvatarWrapper]}>
                    <Ionicons name="person" size={14} color={isMe ? COLORS.gold : COLORS.textPrimary} />
                  </View>
                  <Text style={[styles.playerName, isMe && styles.mePlayerName]} numberOfLines={1}>
                    {player.name}
                  </Text>
                </View>

                {/* Role (Hidden in Lobby) */}
                <Text style={[styles.colRole, styles.roleText]}>
                  Hidden?
                </Text>

                {/* Status / Host Badge */}
                <View style={[styles.colStatus, styles.statusContainer]}>
                  {player.isHost ? (
                    <Text style={styles.hostStatusText}>Host</Text>
                  ) : (
                    <Text style={styles.readyStatusText}>Ready</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {isHost ? (
            <View style={styles.fullWidth}>
              {!canStart && (
                <Text style={styles.warningText}>
                  Waiting for at least {minPlayers} players to begin.
                </Text>
              )}
              <Button
                title="START GAME"
                onPress={startGame}
                variant={canStart ? 'primary' : 'disabled'}
                disabled={!canStart}
                style={styles.actionBtn}
              />
            </View>
          ) : (
            <View style={styles.waitingHostContainer}>
              <ActivityIndicator size="small" color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.waitingHostText}>Waiting for host to start...</Text>
            </View>
          )}

          <Button
            title="INVITE FRIENDS"
            onPress={handleInvite}
            variant="outline"
            style={[styles.actionBtn, styles.inviteBtn]}
            icon={<Ionicons name="share-social-outline" size={16} color={COLORS.white} />}
          />
        </View>

        {/* Circular Bottom Controls inside Card */}
        <View style={styles.bottomControls}>
          <View style={styles.controlItem}>
            <TouchableOpacity style={styles.controlCircle} activeOpacity={0.8}>
              <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.dotIndicatorActive} />
          </View>

          <View style={styles.controlItem}>
            <TouchableOpacity style={styles.controlCircle} activeOpacity={0.8}>
              <Ionicons name="settings" size={18} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.dotIndicatorActive} />
          </View>

          <View style={styles.controlItem}>
            <TouchableOpacity style={[styles.controlCircle, styles.controlCircleInactive]} activeOpacity={0.8}>
              <Ionicons name="bar-chart" size={18} color={COLORS.navIconInactive} />
            </TouchableOpacity>
            <View style={styles.dotIndicatorInactive} />
          </View>
        </View>
      </Card>

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

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <View style={styles.confirmOverlay}>
          <Card style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>EXIT LOBBY</Text>
            <Text style={styles.confirmText}>Are you sure you want to leave the game lobby?</Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 104 : 84,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomNavBorder,
    backgroundColor: COLORS.bottomNavBg,
    zIndex: 999,
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 2,
    position: 'absolute',
    left: 56,
    right: 56,
    textAlign: 'center',
  },
  headerBackButton: {
    padding: 8,
    zIndex: 1000,
  },
  lobbyCard: {
    flex: 1,
    width: '100%',
    maxWidth: 360,
    maxHeight: 480, // Slightly smaller height to fit bottom nav bar perfectly
  },
  lobbyTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  lobbyStatus: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusWaiting: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.gold,
  },
  playerCount: {
    color: COLORS.textMuted,
  },
  roomCodeSub: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20, // Reduced from 28 to fit inside max height
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 8,
    marginBottom: 8,
  },
  columnHeader: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  colUsername: {
    flex: 2,
  },
  colRole: {
    flex: 1.2,
    textAlign: 'center',
  },
  colStatus: {
    flex: 1,
    textAlign: 'right',
  },
  playerListScroll: {
    flex: 1,
    width: '100%',
  },
  playerListContent: {
    paddingBottom: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Reduced from 15 to fit inside compact layout
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  meAvatarWrapper: {
    borderColor: COLORS.goldTranslucent,
    borderWidth: 1,
  },
  playerName: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 0.5,
    flex: 1,
  },
  mePlayerName: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.gold,
  },
  roleText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  readyStatusText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  hostStatusText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.mafia,
    letterSpacing: 0.5,
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.cardDivider,
    marginVertical: 12, // Reduced from 20 to fit inside compact layout
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  actionBtn: {
    width: '100%',
    marginBottom: 8, // Reduced from 12
  },
  inviteBtn: {
    borderColor: COLORS.cardBorder,
    borderWidth: 2.5,
  },
  warningText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.redBright,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  waitingHostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
    marginBottom: 8,
  },
  waitingHostText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 1,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    gap: 16,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlCircle: {
    width: 40, // Reduced from 44
    height: 40, // Reduced from 44
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.borderLight,
    borderWidth: 1.5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  controlCircleInactive: {
    opacity: 0.6,
  },
  dotIndicatorActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.redBright,
    marginTop: 4,
  },
  dotIndicatorInactive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 4,
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
});
