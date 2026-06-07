import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';

export default function DayScreen() {
  const {
    myId,
    players,
    hostId,
    killedId,
    startVoting,
  } = useGameStore();

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const killedPlayer = killedId ? players[killedId] : null;

  return (
    <View style={styles.innerContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitleGold}>DAY PHASE</Text>
        <Text style={styles.phaseDesc}>The sun rises. Shadows retreat.</Text>
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
                They were brutally eliminated in their sleep. Faction: {killedPlayer.role}.
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
              <Text style={[styles.playerNameText, !player.isAlive && styles.strikeThrough]}>
                {player.name.toUpperCase()}
              </Text>
              <Text style={player.isAlive ? styles.aliveLabel : styles.deadLabel}>
                {player.isAlive ? 'ALIVE' : '💀 ELIMINATED'}
              </Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.infoText}>
            Discuss as a town to identify the Mafia. Host will call for votes when the discussion is finished.
          </Text>
        </Card>
      </ScrollView>

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
});
