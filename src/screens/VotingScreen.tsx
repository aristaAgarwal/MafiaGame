import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';

export default function VotingScreen() {
  const {
    myId,
    players,
    hostId,
    votes,
    submitVote,
    endVoting,
  } = useGameStore();

  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [voteCast, setVoteCast] = useState(false);

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const me = myId ? players[myId] : null;
  const isAlive = me ? me.isAlive : false;

  const aliveOthers = playersList.filter((p) => p.isAlive);

  // Group votes by target player ID for counting
  const voteTallies: Record<string, string[]> = {};
  Object.entries(votes).forEach(([voterId, targetId]) => {
    const voterName = players[voterId]?.name || 'Unknown';
    if (!voteTallies[targetId]) {
      voteTallies[targetId] = [];
    }
    voteTallies[targetId].push(voterName);
  });

  const handleCastVote = () => {
    if (!selectedTarget) {
      Alert.alert('No Selection', 'Please select a player to vote.');
      return;
    }
    submitVote(selectedTarget);
    setVoteCast(true);
  };

  return (
    <View style={styles.innerContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitleGold}>TOWN ACCUSATIONS</Text>
        <Text style={styles.phaseDesc}>Cast your vote to execute the suspected Mafia.</Text>
      </View>

      <ScrollView style={styles.actionContainer}>
        {isAlive && !voteCast ? (
          <Card header="VOTE WHO TO ELIMINATE">
            {aliveOthers.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.targetSelectRow,
                  selectedTarget === player.id && styles.targetSelectRowSelected,
                ]}
                onPress={() => setSelectedTarget(player.id)}
              >
                <Text style={styles.playerNameText}>{player.name.toUpperCase()}</Text>
                <View style={styles.radioOuter}>
                  {selectedTarget === player.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}

            <Button
              title="Cast Accusation Vote"
              onPress={handleCastVote}
              style={{ marginTop: 15 }}
            />
          </Card>
        ) : isAlive ? (
          <Card>
            <Text style={styles.successText}>Vote Registered.</Text>
            <Text style={styles.infoText}>Waiting for others to finish voting.</Text>
          </Card>
        ) : (
          <Card>
            <Text style={styles.roleTitle}>YOU ARE DEAD</Text>
            <Text style={styles.roleDesc}>Eliminated players cannot cast votes.</Text>
          </Card>
        )}

        <Card header="LIVE TALLY">
          {aliveOthers.map((player) => {
            const voters = voteTallies[player.id] || [];
            return (
              <View key={player.id} style={styles.tallyRow}>
                <View style={styles.tallyInfo}>
                  <Text style={styles.playerNameText}>{player.name.toUpperCase()}</Text>
                  <Text style={styles.tallyCountText}>VOTES: {voters.length}</Text>
                </View>
                {voters.length > 0 && (
                  <Text style={styles.tallyVotersText}>
                    BY: {voters.join(', ').toUpperCase()}
                  </Text>
                )}
              </View>
            );
          })}
        </Card>
      </ScrollView>

      {isHost && (
        <View style={styles.hostPanel}>
          <Text style={styles.hostPanelHeader}>HOST CONTROL ROOM</Text>
          <Button title="TALLY VOTES & END DAY" onPress={endVoting} />
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
  roleTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: COLORS.mafia,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  roleDesc: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  targetSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  targetSelectRowSelected: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(200, 160, 74, 0.05)',
  },
  playerNameText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  successText: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.doctor,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  infoText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  tallyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tallyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tallyCountText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  tallyVotersText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
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
