import * as React from 'react';
import { View } from 'react-native';

type Props = {
  center?: boolean;
  children: React.ReactNode;
};

export default function Row({ center, children }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: center ? 'center' : 'flex-start',
      }}
    >
      {children}
    </View>
  );
}
