import * as React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = TouchableOpacityProps & {
  children: string;
};

export default function IOSButton({ children, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity {...rest}>
      <Text style={[styles.label, { color: colors.primary }]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    padding: 12,
    fontSize: 16,
  },
});
