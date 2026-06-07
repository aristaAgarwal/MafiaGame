import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/theme';

export default function Toast() {
  const toast = useGameStore((state) => state.toast);

  if (!toast) return null;

  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{toast}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 80,
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
