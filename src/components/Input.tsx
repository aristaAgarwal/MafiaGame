import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../constants/theme';

interface InputProps extends RNTextInputProps {
  label?: string;
  isCode?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export default function Input({
  label,
  isCode = false,
  containerStyle,
  labelStyle,
  inputStyle,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label.toUpperCase()}</Text>}
      <RNTextInput
        style={[
          styles.input,
          isCode && styles.codeInput,
          inputStyle,
        ]}
        placeholderTextColor="#4A3E32"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 3,
  },
  input: {
    fontFamily: 'Cinzel_400Regular',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  codeInput: {
    fontSize: 20,
    letterSpacing: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
