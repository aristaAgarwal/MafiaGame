import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ChatOverlay from '../components/ChatOverlay';
import PlayerAvatar from '../components/PlayerAvatar';

export default function DayScreen() {
  const {
    myId,
    players,
    hostId,
    killedId,
    startVoting,
    kickPlayer,
    settings,
  } = useGameStore();

  const [isChatVisible, setChatVisible] = useState(false);

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const killedPlayer = killedId ? players[killedId] : null;

  return (
    <View style={styles.innerContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitleGold}>DAY PHASE</Text>
        <Text style={styles.phaseDesc}>The sun rises. Shadows retreat.</Text>
        <TouchableOpacity 
          style={styles.chatFloatingButton}
          activeOpacity={0.7}
          onPress={() => setChatVisible(true)}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color={COLORS.gold} />
          <Text style={styles.chatButtonText}>TOWN CHAT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.actionContainer}>
        <View style={styles.newsCard}>
          <Text style={styles.newsHeader}>BREAKING NEWS</Text>
          {killedPlayer ? (
            <View>
              <Text style={styles.newsHeadlineCrimson}>
                {killedPlayer.name.toUpperCase()} WAS FOUND DEAD.
              </Text>
              <Text style={styles.newsSubtext}>
                They were brutally eliminated in their sleep. Faction: {settings.revealRoles ? killedPlayer.role : 'Hidden'}.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.newsHeadlineEmerald}>
                NOBODY DIED LAST NIGHT!
              </Text>
              <Text style={styles.newsSubtext}>
                The Doctor protected the targeted citizen just in time.
              </Text>
            </View>
          )}
        </View>

        <Card header="SURVIVORS & ELIMINATED">
          {playersList.map((player) => (
            <View
              key={player.id}
              style={[
                styles.playerListRow,
                !player.isAlive && styles.playerListRowDead,
              ]}
            >
              <View style={styles.playerInfoRow}>
                <PlayerAvatar
                  avatar={player.avatar}
                  size={28}
                  borderRadius={6}
                  isHighlighted={player.isAlive}
                />
                <Text style={[styles.playerNameText, !player.isAlive && styles.strikeThrough, { marginLeft: 10 }]}>
                  {player.name.toUpperCase()}
                </Text>
                {!player.isOnline && player.isAlive && (
                  <Text style={styles.offlineTag}> (OFFLINE)</Text>
                )}
              </View>

              <View style={styles.statusContainer}>
                {!player.isOnline && player.isAlive ? (
                  <View style={styles.offlineActionRow}>
                    <Text style={styles.offlineStatusText}>Offline</Text>
                    {isHost && (
                      <TouchableOpacity 
                        onPress={() => kickPlayer(player.id)}
                        style={styles.smallKickBtn}
                      >
                        <Ionicons name="close-circle" size={16} color={COLORS.redBright} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <Text style={player.isAlive ? styles.aliveLabel : styles.deadLabel}>
                    {player.isAlive ? 'ALIVE' : '💀 ELIMINATED'}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </Card>

      </ScrollView>

      <ChatOverlay 
        channel="day" 
        visible={isChatVisible} 
        onClose={() => setChatVisible(false)} 
      />

      {isHost && (
        <View style={styles.hostPanel}>
          <Text style={styles.hostPanelHeader}>HOST CONTROL ROOM</Text>
          <Button title="START ACCUSATION VOTES" onPress={startVoting} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  phaseHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  phaseTitleGold: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  phaseDesc: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 1,
  },
  actionContainer: {
    flex: 1,
  },
  newsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
  },
  newsHeader: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  newsHeadlineCrimson: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: COLORS.redBright,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  newsHeadlineEmerald: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: COLORS.doctor,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  newsSubtext: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 6,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  playerListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  playerListRowDead: {
    opacity: 0.5,
  },
  playerNameText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  aliveLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.doctor,
    backgroundColor: COLORS.overlayGold05,
    borderWidth: 1,
    borderColor: COLORS.overlayGold20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deadLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.mafia,
    backgroundColor: COLORS.overlayRed05,
    borderWidth: 1,
    borderColor: COLORS.overlayRed20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  infoText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  hostPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    marginTop: 20,
  },
  hostPanelHeader: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  playerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineTag: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.redBright,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  offlineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineStatusText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: COLORS.redBright,
    letterSpacing: 0.5,
  },
  smallKickBtn: {
    marginLeft: 6,
    padding: 2,
  },
  chatFloatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderGold,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    gap: 6,
  },
  chatButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 1,
  },
});
