import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import Card from '../components/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 342);

interface RuleCardData {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  text: string;
  glowColor?: string;
}

const RULES_DATA: RuleCardData[] = [
  {
    title: "THE PREMISE",
    subtitle: "CITY OF SHADOWS",
    icon: "eye-off-outline",
    iconColor: COLORS.white,
    text: "Mafia is a social deduction game of deception, strategy, and survival. A secret criminal syndicate (Mafia) has infiltrated the town, attempting to eliminate the honest citizens (Villagers) one by one. The citizens must work together to deduce who the impostors are before they lose control of the city.",
    glowColor: COLORS.gold,
  },
  {
    title: "THE MAFIA",
    subtitle: "SHADOW CONSPIRATORS",
    icon: "skull-outline",
    iconColor: COLORS.mafia,
    text: "As a member of the Mafia, you operate in the shadows. Each night, vote with your syndicate to eliminate a target. During the day, blend in with the innocent villagers, deflect suspicion, and coordinate to execute the remaining citizens.",
    glowColor: COLORS.mafia,
  },
  {
    title: "THE POLICE",
    subtitle: "THE SECRET DETECTIVE",
    icon: "search-outline",
    iconColor: COLORS.police,
    text: "As the Police detective, you investigate suspects under the cover of night. Select one player each night to reveal their true alignment (Mafia or Villager). Use this knowledge strategically to guide the town's votes without revealing your identity.",
    glowColor: COLORS.police,
  },
  {
    title: "THE DOCTOR",
    subtitle: "THE INNOCENT SAVIOR",
    icon: "heart-outline",
    iconColor: COLORS.doctor,
    text: "As the Doctor, you protect the city from the Mafia's nightly strikes. Choose one player each night to save. If your target is attacked, they will survive the night. You can save yourself once per game.",
    glowColor: COLORS.doctor,
  },
  {
    title: "THE VILLAGER",
    subtitle: "HEARTBEAT OF THE CITY",
    icon: "people-outline",
    iconColor: COLORS.villager,
    text: "As a Villager, you represent the honest townspeople. You have no special night abilities, but you possess the ultimate power: discussion and voting. Share observations, analyze behavioral cues, and vote to eliminate the Mafia during the Day.",
    glowColor: COLORS.villager,
  },
  {
    title: "THE CYCLE",
    subtitle: "NIGHT & DAY PHASES",
    icon: "sync-outline",
    iconColor: COLORS.gold,
    text: "The game alternates between two key phases:\n\n• NIGHT: All players close their eyes while special roles (Mafia, Doctor, Police) secretly submit actions.\n\n• DAY: The victim is revealed, followed by open discussion and a democratic vote to execute a suspect.",
    glowColor: COLORS.gold,
  }
];

interface RulesScreenProps {
  onBackToHome?: () => void;
}

export default function RulesScreen({ onBackToHome }: RulesScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < RULES_DATA.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const activeCard = RULES_DATA[activeIndex];
  const progressPercent = ((activeIndex + 1) / RULES_DATA.length) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.screenLabel}>FIELD MANUAL</Text>
      
      {/* Custom Card Wrapper with glow transition */}
      <Card
        header={activeCard.title}
        style={[
          styles.rulesCard,
          activeCard.glowColor ? { shadowColor: activeCard.glowColor } : {}
        ]}
      >
        {/* Progress Bar Visualizer */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.cardContent}>
          {/* Central Visual Icon */}
          <View style={[styles.iconWrapper, { borderColor: activeCard.glowColor || COLORS.gold }]}>
            <Ionicons name={activeCard.icon as any} size={44} color={activeCard.iconColor} />
          </View>

          <Text style={[styles.subtitleText, { color: activeCard.glowColor || COLORS.gold }]}>
            {activeCard.subtitle}
          </Text>

          <Text style={styles.descText}>
            {activeCard.text}
          </Text>
        </View>
      </Card>

      {/* Pagination Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={activeIndex === 0}
          style={[styles.arrowBtn, activeIndex === 0 && styles.disabledArrow]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color={activeIndex === 0 ? COLORS.navIconInactive : COLORS.white}
          />
        </TouchableOpacity>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {RULES_DATA.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.dot,
                index === activeIndex && { backgroundColor: activeCard.glowColor || COLORS.gold, width: 14 }
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={styles.arrowBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeIndex === RULES_DATA.length - 1 ? "checkmark-outline" : "chevron-forward-outline"}
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: CARD_WIDTH,
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  screenLabel: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 16,
    color: COLORS.gold,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  rulesCard: {
    width: '100%',
    minHeight: 330,
  },
  progressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1.5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  subtitleText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },
  descText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13.5,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
    paddingHorizontal: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledArrow: {
    opacity: 0.3,
    borderColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
