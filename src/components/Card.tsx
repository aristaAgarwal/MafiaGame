import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
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
    <View style={[styles.card, style]}>
      {header && <Text style={[styles.cardHeader, headerStyle]}>{header.toUpperCase()}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 192, 106, 0.45)', // Translucent Yellow border
    shadowColor: '#E8C06A', // Yellow glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
    width: '100%',
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
