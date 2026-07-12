import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/theme';

interface LobbySettingsProps {
  visible: boolean;
  onClose: () => void;
}

const CustomToggle = ({ 
  value, 
  onValueChange, 
  disabled 
}: { 
  value: boolean; 
  onValueChange: (v: boolean) => void; 
  disabled: boolean; 
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.switchTrack,
        value ? styles.switchTrackActive : styles.switchTrackInactive
      ]}
    >
      <View style={[
        styles.switchThumb,
        value ? styles.switchThumbActive : styles.switchThumbInactive
      ]} />
    </TouchableOpacity>
  );
};

export default function LobbySettings({ visible, onClose }: LobbySettingsProps) {
  const {
    myId,
    hostId,
    settings,
    updateSettings,
  } = useGameStore();

  const isHost = myId === hostId;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        <ImageBackground
          source={require('../../assets/background.jpeg')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <SafeAreaView style={styles.settingsSafeArea}>
          {/* Settings Header */}
          <View style={styles.settingsHeader}>
            <TouchableOpacity 
              style={styles.settingsBackBtn}
              onPress={onClose}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.settingsTitleText}>SETTINGS</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Cards Scroll */}
          <ScrollView 
            style={styles.settingsScroll}
            contentContainerStyle={styles.settingsContentContainer}
          >
            {/* Mafia Count Card */}
            <View style={styles.settingCard}>
              <Text style={styles.cardTitleText}>Mafia Count</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((settings.mafiaCount - 1) / 4) * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${((settings.mafiaCount - 1) / 4) * 100}%`, transform: [{ translateX: -16 }] }]}>
                    <Text style={styles.sliderThumbText}>{settings.mafiaCount}</Text>
                  </View>
                </View>
                <View style={styles.ticksRow}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <TouchableOpacity 
                      key={val} 
                      disabled={!isHost}
                      onPress={() => updateSettings({ mafiaCount: val })}
                      style={styles.tickClickArea}
                    >
                      <Text style={[
                        styles.tickLabel,
                        settings.mafiaCount === val && styles.tickLabelActive
                      ]}>
                        {val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Enable Police Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="shield-outline" size={20} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>Enable Police</Text>
                  <Text style={styles.cardDescText}>allows the Police player to investigate roles</Text>
                </View>
                <CustomToggle
                  value={settings.hasPolice}
                  onValueChange={(val) => updateSettings({ hasPolice: val })}
                  disabled={!isHost}
                />
              </View>
            </View>

            {/* Enable Doctor Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="add" size={22} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>Enable Doctor</Text>
                  <Text style={styles.cardDescText}>allows the Doctor player to save a life</Text>
                </View>
                <CustomToggle
                  value={settings.hasDoctor}
                  onValueChange={(val) => updateSettings({ hasDoctor: val })}
                  disabled={!isHost}
                />
              </View>
            </View>

            {/* Hide Role During Eviction Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="eye-off-outline" size={20} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>Hide Role During Eviction</Text>
                  <Text style={styles.cardDescText}>conceals the role of the player being evicted</Text>
                </View>
                <CustomToggle
                  value={!settings.revealRoles}
                  onValueChange={(val) => updateSettings({ revealRoles: !val })}
                  disabled={!isHost}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#0c0c0e',
  },
  settingsSafeArea: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingsBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  settingsTitleText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
    color: COLORS.white,
    letterSpacing: 2,
  },
  settingsScroll: {
    flex: 1,
  },
  settingsContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  settingCard: {
    backgroundColor: 'rgba(23, 23, 27, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(217, 38, 38, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(217, 38, 38, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 38, 38, 0.15)',
  },
  cardTextWrapper: {
    flex: 1,
    marginRight: 16,
  },
  cardTitleText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: 1,
  },
  cardDescText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 15,
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3a3a40',
  },
  switchTrackActive: {
    backgroundColor: '#9c1212',
  },
  switchTrackInactive: {
    backgroundColor: '#1b1b1f',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2e2e33',
    borderWidth: 1.5,
    borderColor: '#4d4d54',
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  switchThumbInactive: {
    transform: [{ translateX: 0 }],
  },
  sliderContainer: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#1b1b1f',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3a40',
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#9c1212',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#a31212',
    borderWidth: 2.5,
    borderColor: '#4d0808',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  sliderThumbText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.white,
  },
  ticksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  tickClickArea: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tickLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tickLabelActive: {
    color: COLORS.white,
    fontFamily: 'Cinzel_700Bold',
  },
});
