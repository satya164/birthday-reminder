import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import {
  Provider,
  DefaultTheme as PaperDefaultTheme,
  Text,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';

const PaperTheme = {
  ...PaperDefaultTheme,
  fonts: {
    ...PaperDefaultTheme.fonts,
    regular: { fontFamily: 'Lato-Regular' },
    medium: { fontFamily: 'Lato-Medium' },
    light: { fontFamily: 'Lato-Light' },
    Thin: { fontFamily: 'Lato-Thin' },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Medium': require('../assets/fonts/Lato-Medium.ttf'),
    'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
    'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider theme={PaperTheme}>
      <NavigationContainer>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
