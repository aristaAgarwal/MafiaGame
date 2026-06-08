import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/theme';

export default function Toast() {
  const toast = useGameStore((state) => state.toast);
  const phase = useGameStore((state) => state.phase);

  if (!toast) return null;

  const topOffset = phase === 'HOME' || !phase
    ? (Platform.OS === 'ios' ? 60 : 40)
    : (Platform.OS === 'ios' ? 120 : 100);

  return (
    <View style={[styles.toastContainer, { top: topOffset }]}>
      <Text style={styles.toastText}>{toast}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: COLORS.toastBg,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
  },
  toastText: {
    fontFamily: 'Cinzel_700Bold',
    color: COLORS.textPrimary,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
