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

  // Discussion timer percentage index mapping
  const discussionTicks = [30, 60, 90, 120, 180];
  const discussionVal = settings.discussionTimer || 60;
  const discussionIdx = discussionTicks.indexOf(discussionVal);
  const discussionPercent = discussionIdx !== -1 ? (discussionIdx / 4) * 100 : 25;

  // Night action timer percentage index mapping
  const nightTicks = [15, 30, 45, 60, 90];
  const nightVal = settings.nightActionTimer || 30;
  const nightIdx = nightTicks.indexOf(nightVal);
  const nightPercent = nightIdx !== -1 ? (nightIdx / 4) * 100 : 25;

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
            {/* --- SECTION 1: CORE METRICS --- */}
            <Text style={styles.sectionHeader}>CORE CONFIGURATION</Text>

            {/* Mafia Count Card */}
            <View style={styles.settingCard}>
              <Text style={styles.cardTitleText}>Mafia Count</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrackContainer}>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${((settings.mafiaCount - 1) / 4) * 100}%` }]} />
                    <View style={[styles.sliderThumb, { left: `${((settings.mafiaCount - 1) / 4) * 100}%`, transform: [{ translateX: -16 }] }]}>
                      <Text style={styles.sliderThumbText}>{settings.mafiaCount}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sliderColumnsRow}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <TouchableOpacity 
                      key={val} 
                      disabled={!isHost}
                      activeOpacity={0.7}
                      onPress={() => updateSettings({ mafiaCount: val })}
                      style={styles.sliderColumn}
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

            {/* Town Discussion Timer Card */}
            <View style={styles.settingCard}>
              <Text style={styles.cardTitleText}>Town Discussion Timer</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrackContainer}>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${discussionPercent}%` }]} />
                    <View style={[styles.sliderThumb, { left: `${discussionPercent}%`, transform: [{ translateX: -16 }] }]}>
                      <Text style={styles.sliderThumbText}>
                        {discussionVal === 180 ? '∞' : `${discussionVal}s`}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sliderColumnsRow}>
                  {discussionTicks.map((val) => (
                    <TouchableOpacity 
                      key={val} 
                      disabled={!isHost}
                      activeOpacity={0.7}
                      onPress={() => updateSettings({ discussionTimer: val })}
                      style={styles.sliderColumn}
                    >
                      <Text style={[
                        styles.tickLabel,
                        discussionVal === val && styles.tickLabelActive
                      ]}>
                        {val === 180 ? '∞' : `${val}s`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Night Action Timer Card */}
            <View style={styles.settingCard}>
              <Text style={styles.cardTitleText}>Night Action Timer</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrackContainer}>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${nightPercent}%` }]} />
                    <View style={[styles.sliderThumb, { left: `${nightPercent}%`, transform: [{ translateX: -16 }] }]}>
                      <Text style={styles.sliderThumbText}>{nightVal}s</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sliderColumnsRow}>
                  {nightTicks.map((val) => (
                    <TouchableOpacity 
                      key={val} 
                      disabled={!isHost}
                      activeOpacity={0.7}
                      onPress={() => updateSettings({ nightActionTimer: val })}
                      style={styles.sliderColumn}
                    >
                      <Text style={[
                        styles.tickLabel,
                        nightVal === val && styles.tickLabelActive
                      ]}>
                        {val}s
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* --- SECTION 2: SPECIAL ROLE TOGGLES (COMING SOON) --- */}
            <Text style={styles.sectionHeader}>SPECIAL ROLES</Text>

            {/* Godfather Card */}
            <View style={[styles.settingCard, styles.comingSoonCard]}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="skull-outline" size={20} color="#666" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text style={[styles.cardTitleText, styles.comingSoonText]}>Godfather</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>SOON</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescText}>immunizes a Mafia player to Police inspection</Text>
                </View>
                <CustomToggle
                  value={false}
                  onValueChange={() => {}}
                  disabled={true}
                />
              </View>
            </View>

            {/* Vigilante Card */}
            <View style={[styles.settingCard, styles.comingSoonCard]}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="disc-outline" size={20} color="#666" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text style={[styles.cardTitleText, styles.comingSoonText]}>Vigilante</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>SOON</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescText}>gives a Town player one shot per game to eliminate a suspect</Text>
                </View>
                <CustomToggle
                  value={false}
                  onValueChange={() => {}}
                  disabled={true}
                />
              </View>
            </View>

            {/* Jester Card */}
            <View style={[styles.settingCard, styles.comingSoonCard]}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="happy-outline" size={20} color="#666" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <View style={styles.titleWithBadgeRow}>
                    <Text style={[styles.cardTitleText, styles.comingSoonText]}>Jester</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>SOON</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescText}>adds neutral player who wins if voted out by town</Text>
                </View>
                <CustomToggle
                  value={false}
                  onValueChange={() => {}}
                  disabled={true}
                />
              </View>
            </View>

            {/* --- SECTION 3: GAMEPLAY MECHANICS --- */}
            <Text style={styles.sectionHeader}>GAMEPLAY RULES</Text>

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

            {/* Doctor Self-Save Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="heart-outline" size={20} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>Doctor Self-Save</Text>
                  <Text style={styles.cardDescText}>allows the Doctor to protect themselves at night</Text>
                </View>
                <CustomToggle
                  value={settings.doctorSelfSave !== false}
                  onValueChange={(val) => updateSettings({ doctorSelfSave: val })}
                  disabled={!isHost || !settings.hasDoctor}
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

            {/* Anonymous Voting Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="people-outline" size={20} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>Anonymous Voting</Text>
                  <Text style={styles.cardDescText}>masks who voted for whom in the live voting tally</Text>
                </View>
                <CustomToggle
                  value={!!settings.anonymousVoting}
                  onValueChange={(val) => updateSettings({ anonymousVoting: val })}
                  disabled={!isHost}
                />
              </View>
            </View>

            {/* First Night Shield Card */}
            <View style={styles.settingCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="sparkles-outline" size={20} color="#a31212" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitleText}>First Night Shield</Text>
                  <Text style={styles.cardDescText}>prevents any deaths from occurring on Night 1</Text>
                </View>
                <CustomToggle
                  value={!!settings.firstNightShield}
                  onValueChange={(val) => updateSettings({ firstNightShield: val })}
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
  sectionHeader: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 10,
    paddingLeft: 4,
    opacity: 0.85,
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
  comingSoonCard: {
    borderColor: 'rgba(100, 100, 100, 0.15)',
    opacity: 0.65,
  },
  comingSoonText: {
    color: '#8c8c94',
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
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: COLORS.goldTranslucent,
    borderWidth: 0.8,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    marginLeft: 8,
  },
  comingSoonBadgeText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 8,
    color: COLORS.gold,
    letterSpacing: 0.5,
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
    marginTop: 12,
    position: 'relative',
    height: 70,
    justifyContent: 'center',
  },
  sliderTrackContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 12,
    height: 32,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#1b1b1f',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3a40',
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#9c1212',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -12,
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
    fontSize: 10, // slightly smaller to fit strings like '180s' or '120s'
    color: COLORS.white,
  },
  sliderColumnsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  tickLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  tickLabelActive: {
    color: COLORS.white,
    fontFamily: 'Cinzel_700Bold',
  },
});
