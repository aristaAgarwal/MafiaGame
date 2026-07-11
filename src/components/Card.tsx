import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  header?: string;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<TextStyle>;
}

export default function Card({
  children,
  header,
  style,
  headerStyle,
}: CardProps) {
  return (
    <View style={[styles.shadowWrapper, style]}>
      <BlurView
        intensity={90}
        tint="dark"
        style={styles.card}
      >
        {header && <Text style={[styles.cardHeader, headerStyle]}>{header.toUpperCase()}</Text>}
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 20,
    shadowColor: COLORS.gold, // Gold glow color
    shadowOffset: { width: 0, height: 0 }, // Center glow around the border
    shadowOpacity: 0.6,
    shadowRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface, // Dark translucent background for glassmorphism
    borderRadius: 20, // Match the wrapper's radius exactly
    borderWidth: 1.5, // Elegant thin border
    borderColor: COLORS.cardBorder, // Translucent gold border
    padding: 24,
    width: '100%',
    overflow: 'hidden',
  },
  cardHeader: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },
});
