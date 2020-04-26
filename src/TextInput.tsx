import * as React from 'react';
import {
  View,
  TextInput as NativeTextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import TextInputLabel from './TextInputLabel';

type Props = TextInputProps & {
  label?: string;
};

export default function TextInput({ label, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label ? <TextInputLabel>{label}</TextInputLabel> : null}
      <NativeTextInput {...rest} style={[styles.input, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
  },
});
