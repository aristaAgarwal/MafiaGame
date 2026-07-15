import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface PlayerAvatarProps {
  avatar?: string | null;
  size?: number;
  borderRadius?: number;
  isHighlighted?: boolean;
  serverUrl?: string;
}

/**
 * Reusable avatar component that displays a player's selected avatar image
 * or falls back to a generic person icon.
 */
export default function PlayerAvatar({
  avatar,
  size = 28,
  borderRadius = 6,
  isHighlighted = false,
  serverUrl,
}: PlayerAvatarProps) {
  const hasAvatar = !!avatar;

  const resolveAvatarUri = (avatarPath: string): string => {
    // If it's already a full URL, use as-is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    // Build full URL from server base
    const base = serverUrl || process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    return `${base}${avatarPath}`;
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
        },
        isHighlighted && styles.highlighted,
      ]}
    >
      {hasAvatar ? (
        <Image
          source={{ uri: resolveAvatarUri(avatar) }}
          style={[
            styles.image,
            {
              width: size - 2,
              height: size - 2,
              borderRadius: borderRadius - 1,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Ionicons
          name="person"
          size={size * 0.5}
          color={isHighlighted ? COLORS.gold : COLORS.textPrimary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlighted: {
    borderColor: COLORS.goldTranslucent,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
