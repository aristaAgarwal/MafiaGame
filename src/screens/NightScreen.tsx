import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ChatOverlay from '../components/ChatOverlay';

export default function NightScreen() {
  const {
    myId,
    players,
    hostId,
    policeResult,
    nightActions,
    submitNightAction,
    endNight,
    eliminatedId,
    settings,
  } = useGameStore();

  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [nightActionSubmitted, setNightActionSubmitted] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);

  const playersList = Object.values(players);
  const isHost = myId === hostId;
  const me = myId ? players[myId] : null;
  const isAlive = me ? me.isAlive : false;
  const myRole = me ? me.role : null;

  const aliveOthers = playersList.filter((p) => p.isAlive && p.id !== myId);
  const aliveAll = playersList.filter((p) => p.isAlive);

  const handleSubmitNight = () => {
    if (!selectedTarget) {
      Alert.alert('No Selection', 'Please select a player first.');
      return;
    }
    submitNightAction(selectedTarget, myRole || '');
    setNightActionSubmitted(true);
  };

  const getRoleColor = () => {
    switch (myRole) {
      case 'MAFIA':
        return COLORS.mafia;
      case 'POLICE':
        return COLORS.police;
      case 'DOCTOR':
        return COLORS.doctor;
      default:
        return COLORS.villager;
    }
  };

  const getRoleInstructions = () => {
    switch (myRole) {
      case 'MAFIA':
        return 'Discuss and select a target to eliminate.';
      case 'DOCTOR':
        return 'Select a target player to protect from elimination tonight.';
      case 'POLICE':
        return 'Select a player to investigate and reveal their alignment.';
      default:
        return 'Close your eyes. Sleep through the night until the sun rises.';
    }
  };

  return (
    <View style={styles.innerContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitleRed}>NIGHT PHASE</Text>
        <Text style={styles.phaseDesc}>The town sleeps. Dark forces gather.</Text>
        {myRole === 'MAFIA' && (
          <TouchableOpacity 
            style={styles.chatFloatingButton}
            activeOpacity={0.7}
            onPress={() => setChatVisible(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color={COLORS.redBright} />
            <Text style={styles.chatButtonText}>MAFIA CHAT</Text>
          </TouchableOpacity>
        )}
      </View>

      {eliminatedId && players[eliminatedId] && (
        <Card style={{ marginBottom: 15, width: '100%' }}>
          <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 10, color: COLORS.redBright, letterSpacing: 1, marginBottom: 4 }}>ELIMINATION NEWS</Text>
          <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 12, color: COLORS.textPrimary, letterSpacing: 0.5 }}>
            {players[eliminatedId].name.toUpperCase()} WAS ELIMINATED BY THE TOWN.
          </Text>
          <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10.5, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.5 }}>
            Faction: {settings.revealRoles ? players[eliminatedId].role : 'Hidden'}
          </Text>
        </Card>
      )}

      {isAlive ? (
        <ScrollView style={styles.actionContainer}>
          <View style={[styles.roleCard, { borderColor: getRoleColor() }]}>
            <Text style={styles.roleSub}>YOUR ROLE</Text>
            <Text style={[styles.roleTitle, { color: getRoleColor() }]}>{myRole}</Text>
            <Text style={styles.roleDesc}>{getRoleInstructions()}</Text>
          </View>

          {myRole !== 'VILLAGER' && !nightActionSubmitted ? (
            <Card header="CHOOSE TARGET PLAYER">
              {(myRole === 'DOCTOR' ? aliveAll : aliveOthers).map((player) => (
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
                title="Submit Action"
                onPress={handleSubmitNight}
                style={{ marginTop: 15 }}
              />
            </Card>
          ) : myRole !== 'VILLAGER' ? (
            <Card>
              <Text style={styles.successText}>Action Submitted.</Text>
              <Text style={styles.infoText}>
                Waiting for other player decisions to compile.
              </Text>
              {myRole === 'POLICE' && policeResult && (
                <View style={styles.policeBox}>
                  <Text style={styles.policeLabel}>POLICE SCAN RESULTS:</Text>
                  <Text style={styles.policeResultName}>
                    {players[policeResult.targetId]?.name || 'Target'} is:
                  </Text>
                  <Text
                    style={[
                      styles.policeResultRole,
                      { color: policeResult.role === 'MAFIA' ? COLORS.mafia : COLORS.doctor },
                    ]}
                  >
                    {policeResult.role}
                  </Text>
                </View>
              )}
            </Card>
          ) : (
            <Card>
              <ActivityIndicator size="small" color={COLORS.white} style={{ marginBottom: 10 }} />
              <Text style={styles.infoText}>
                Sweet dreams... Waiting for Host to end the night.
              </Text>
            </Card>
          )}

        </ScrollView>
      ) : (
        <Card>
          <Text style={styles.roleTitle}>YOU ARE DEAD</Text>
          <Text style={styles.roleDesc}>You were eliminated. You can only spectate.</Text>
        </Card>
      )}

      {isHost && (
        <View style={styles.hostPanel}>
          <Text style={styles.hostPanelHeader}>HOST CONTROL ROOM</Text>
          <View style={styles.actionStatusRow}>
            <Text style={styles.statusLabel}>Mafia Action:</Text>
            <Text style={nightActions.MAFIA ? styles.statusSuccess : styles.statusPending}>
              {nightActions.MAFIA ? 'COMPLETED' : 'PENDING'}
            </Text>
          </View>
          <View style={styles.actionStatusRow}>
            <Text style={styles.statusLabel}>Doctor Action:</Text>
            <Text style={nightActions.DOCTOR ? styles.statusSuccess : styles.statusPending}>
              {nightActions.DOCTOR ? 'COMPLETED' : 'PENDING'}
            </Text>
          </View>
          <View style={styles.actionStatusRow}>
            <Text style={styles.statusLabel}>Police Action:</Text>
            <Text style={nightActions.POLICE ? styles.statusSuccess : styles.statusPending}>
              {nightActions.POLICE ? 'COMPLETED' : 'PENDING'}
            </Text>
          </View>
          <Button title="END NIGHT PHASE" onPress={endNight} style={{ marginTop: 10 }} />
        </View>
      )}

      <ChatOverlay 
        channel="mafia" 
        visible={isChatVisible} 
        onClose={() => setChatVisible(false)} 
      />
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
  phaseTitleRed: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: COLORS.mafia,
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
  roleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    marginBottom: 20,
  },
  roleSub: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  roleTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    marginVertical: 6,
    letterSpacing: 1,
  },
  roleDesc: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.overlayGold05,
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
  policeBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  policeLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.police,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  policeResultName: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  policeResultRole: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    marginTop: 4,
    letterSpacing: 1,
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
  actionStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textPrimary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  statusSuccess: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.doctor,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  statusPending: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.gold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  chatFloatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.redAccent,
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
    color: COLORS.redBright,
    letterSpacing: 1,
  },
});
