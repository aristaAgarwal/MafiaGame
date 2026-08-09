import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '../constants/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export default function Button({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.disabledButton;
    }
    if (variant === 'outline') {
      return styles.outlineButton;
    }
    if (variant === 'secondary') {
      return styles.secondaryButton;
    }
    return styles.primaryButton;
  };

  const getTextStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.disabledText;
    }
    if (variant === 'outline') {
      return styles.outlineText;
    }
    return styles.primaryText;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.gold} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.buttonText, getTextStyle(), textStyle]}>
            {title.toUpperCase()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
    borderWidth: 1,
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  buttonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.textPrimary,
  },
  outlineText: {
    color: COLORS.white,
    fontSize: 8,
    letterSpacing: 1,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});
