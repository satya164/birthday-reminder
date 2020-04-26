import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  children: string;
};

export default function TextInputLabel({ children }: Props) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    marginVertical: 8,
    fontSize: 12,
    opacity: 0.5,
  },
});
