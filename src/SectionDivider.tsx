import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Row from './Row';

type Props = {
  label: string;
};

export default function SectionDivider({ label }: Props) {
  return (
    <Row center style={styles.container}>
      <Divider style={styles.divider} />
      <Text style={styles.label}>{label}</Text>
      <Divider style={styles.divider} />
    </Row>
  );
}

const styles = StyleSheet.create({
  divider: {
    flex: 1,
  },
  container: {
    marginVertical: 8,
  },
  label: {
    opacity: 0.5,
    marginHorizontal: 12,
  },
});
