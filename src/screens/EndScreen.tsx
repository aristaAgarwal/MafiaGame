import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';

export default function EndScreen() {
  const {
    myId,
    players,
    hostId,
    winner,
    resetGame,
  } = useGameStore();

  const playersList = Object.values(players);
  const isHost = myId === hostId;

  return (
    <View style={styles.innerContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.victoryTitle}>GAME OVER</Text>
        <Text style={styles.victorySubtitle}>
          {winner === 'MAFIA' ? 'MAFIA SEIZED CONTROL!' : 'VILLAGERS CLEANSED THE TOWN!'}
        </Text>
      </View>

      <ScrollView style={styles.actionContainer}>
        <Card header="FINAL REVEALS">
          {playersList.map((player) => (
            <View key={player.id} style={styles.revealRow}>
              <View>
                <Text style={styles.playerNameText}>{player.name.toUpperCase()}</Text>
                <Text
                  style={[
                    styles.revealRole,
                    { color: player.role === 'MAFIA' ? COLORS.mafia : COLORS.doctor },
                  ]}
                >
                  ROLE: {player.role}
                </Text>
              </View>
              <Text style={player.isAlive ? styles.aliveLabel : styles.deadLabel}>
                {player.isAlive ? 'SURVIVED' : 'DEAD'}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        {isHost ? (
          <Button title="PLAY AGAIN" onPress={resetGame} variant="primary" />
        ) : (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={styles.waitingText}>WAITING FOR HOST TO RESTART GAME...</Text>
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
  phaseHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  victoryTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 36,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  victorySubtitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1.5,
  },
  actionContainer: {
    flex: 1,
  },
  playerNameText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  revealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  revealRole: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  aliveLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.doctor,
    backgroundColor: 'rgba(232, 192, 106, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232, 192, 106, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deadLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: COLORS.mafia,
    backgroundColor: 'rgba(192, 57, 43, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footer: {
    marginTop: 20,
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
