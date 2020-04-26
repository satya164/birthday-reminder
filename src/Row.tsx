import * as React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

type Props = {
  center?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function Row({ center, style, children }: Props) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: center ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
