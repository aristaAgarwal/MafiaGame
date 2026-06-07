import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';

export default function RoleRevealScreen() {
  const {
    myId,
    players,
    hostId,
    startNight,
  } = useGameStore();

  const isHost = myId === hostId;
  const me = myId ? players[myId] : null;
  const myRole = me ? me.role : 'VILLAGER';

  const getRoleColor = () => {
    switch (myRole) {
      case 'MAFIA':
        return COLORS.mafia;
      case 'POLICE':
        return COLORS.police;
      case 'DOCTOR':
        return COLORS.doctor;
      default:
        return COLORS.white;
    }
  };

  const getRoleInstructions = () => {
    switch (myRole) {
      case 'MAFIA':
        return 'Conspire in the shadows. Eliminate all villagers without getting caught.';
      case 'DOCTOR':
        return 'The savior of the innocent. Choose one player to save each night.';
      case 'POLICE':
        return "The detective of the town. Investigate one player's identity each night.";
      default:
        return 'The heartbeat of the city. Find the mafia members and vote them out.';
    }
  };

  const roleColor = getRoleColor();

  return (
    <View style={styles.screenContainer}>
      {/* Role Reveal Card */}
      <Card style={styles.revealCard}>
        <Text style={styles.cardHeader}>YOUR SECRET IDENTITY</Text>
        
        <View style={styles.roleContainer}>
          <Text style={[styles.roleText, { color: roleColor, textShadowColor: roleColor }]}>
            {myRole}
          </Text>
        </View>

        <Text style={styles.roleDescription}>
          {getRoleInstructions()}
        </Text>

        <View style={styles.divider} />

        {isHost ? (
          <View style={styles.hostActionContainer}>
            <Text style={styles.hostHelpText}>
              AS THE HOST, START THE NIGHT WHEN ALL PLAYERS HAVE SEEN THEIR ROLES.
            </Text>
            <Button
              title="START NIGHT PHASE"
              variant="primary"
              onPress={startNight}
              style={styles.startBtn}
            />
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="small" color={COLORS.gold} style={styles.loader} />
            <Text style={styles.waitingText}>
              WAITING FOR THE HOST TO INITIATE NIGHT...
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealCard: {
    width: '100%',
    maxWidth: 360,
    padding: 32,
    alignItems: 'center',
  },
  cardHeader: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 24,
    textAlign: 'center',
  },
  roleContainer: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 36,
    letterSpacing: 3,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  roleDescription: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderLight,
    marginVertical: 24,
  },
  hostActionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  hostHelpText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 1,
    marginBottom: 20,
  },
  startBtn: {
    width: '100%',
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  loader: {
    marginRight: 4,
  },
  waitingText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 1.5,
    textAlign: 'center',
    flex: 1,
  },
});
