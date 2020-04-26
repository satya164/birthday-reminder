import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: string;
  label: string;
  onPress: () => void;
};

export default function LargeButton({ onPress, label, icon }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.primary }]}
    >
      <>
        <Ionicons name={icon} size={24} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    padding: Platform.select({ ios: 10, default: 12 }),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
  },
  icon: {
    color: 'white',
    marginRight: 16,
  },
});
