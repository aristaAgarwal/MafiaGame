import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';

export default function LobbyScreen() {
  const {
    myId,
    roomCode,
    players,
    hostId,
    startGame,
  } = useGameStore();

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const minPlayers = 3;
  const canStart = playersList.length >= minPlayers;

  return (
    <View style={styles.innerContainer}>
      <View style={styles.lobbyHeader}>
        <Text style={styles.lobbyCodeLabel}>ROOM CODE</Text>
        <Text style={styles.lobbyCode}>{roomCode}</Text>
        <Text style={styles.lobbyCount}>
          PLAYERS CONNECTED: {playersList.length}
        </Text>
      </View>

      <FlatList
        data={playersList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={[styles.playerRow, item.id === myId && styles.mePlayerRow]}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerNameText}>{item.name.toUpperCase()}</Text>
              {item.id === myId && <Text style={styles.meBadge}>YOU</Text>}
            </View>
            {item.isHost ? (
              <View style={styles.hostBadge}>
                <Text style={styles.hostBadgeText}>HOST</Text>
              </View>
            ) : (
              <Text style={styles.statusText}>READY</Text>
            )}
          </View>
        )}
      />

      <View style={styles.footer}>
        {isHost ? (
          <View style={{ width: '100%' }}>
            {!canStart && (
              <Text style={styles.warningText}>
                WAITING FOR AT LEAST {minPlayers} PLAYERS TO BEGIN.
              </Text>
            )}
            <Button
              title="START GAME"
              onPress={startGame}
              variant={canStart ? 'primary' : 'disabled'}
              disabled={!canStart}
            />
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={styles.waitingText}>WAITING FOR HOST TO START...</Text>
          </View>
        )}
      </View>
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
  lobbyHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  lobbyCodeLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  lobbyCode: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 48,
    color: COLORS.gold,
    marginVertical: 12,
    letterSpacing: 4,
  },
  lobbyCount: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  listContainer: {
    paddingVertical: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mePlayerRow: {
    borderColor: COLORS.borderGold,
    backgroundColor: COLORS.overlayGold05,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerNameText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  meBadge: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 8,
    color: COLORS.gold,
    backgroundColor: COLORS.overlayGold15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    letterSpacing: 1,
  },
  statusText: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.doctor,
    fontSize: 12,
    letterSpacing: 1,
  },
  hostBadge: {
    backgroundColor: COLORS.overlayRed15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.mafia,
  },
  hostBadgeText: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.mafia,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 20,
  },
  warningText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.redBright,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  waitingText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    marginLeft: 10,
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
