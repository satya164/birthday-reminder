import * as React from 'react';
import { AppLoading } from 'expo';
import {
  Provider,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import BirthdayList from './BirthdayList';
import { StackParamList } from './types';

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

const Stack = createNativeStackNavigator<StackParamList>();

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
        <Stack.Navigator>
          <Stack.Screen
            name="BirthdayList"
            component={BirthdayList}
            options={{ title: '🎂 Birthdays' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

enableScreens();
