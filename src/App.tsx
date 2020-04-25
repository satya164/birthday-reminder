import * as React from 'react';
import { AppLoading } from 'expo';
import {
  Provider,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from '@use-expo/font';
import { nanoid } from 'nanoid/non-secure';
import BirthdayList from './BirthdayList';
import AddBirthday from './AddBirthday';
import ProfilesContext, { ProfilesContextType } from './ProfilesContext';
import usePersistedState from './usePersistedState';
import { StackParamList, Profile } from './types';

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

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  const [isLoading, profiles, setProfiles] = usePersistedState<Profile[]>(
    [],
    'profiles'
  );

  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Medium': require('../assets/fonts/Lato-Medium.ttf'),
    'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
    'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
  });

  const profilesContext = React.useMemo<ProfilesContextType>(
    () => ({
      profiles,
      add: (...items) =>
        setProfiles((profiles) => [
          ...profiles,
          ...items.map((profile) => ({ ...profile, id: nanoid() })),
        ]),
      remove: (id) =>
        setProfiles((profiles) => profiles.filter((p) => p.id !== id)),
      update: (id, profile) =>
        setProfiles((profiles) =>
          profiles.map((p) => (p.id === id ? { ...p, ...profile } : p))
        ),
    }),
    [profiles, setProfiles]
  );

  if (!fontsLoaded || isLoading) {
    return <AppLoading />;
  }

  return (
    <Provider theme={PaperTheme}>
      <NavigationContainer>
        <ProfilesContext.Provider value={profilesContext}>
          <Stack.Navigator mode="modal">
            <Stack.Screen
              name="BirthdayList"
              component={BirthdayList}
              options={{ title: '🎂 Birthdays' }}
            />
            <Stack.Screen
              name="AddBirthday"
              component={AddBirthday}
              options={{ title: 'Add a birthday' }}
            />
          </Stack.Navigator>
        </ProfilesContext.Provider>
      </NavigationContainer>
    </Provider>
  );
}

enableScreens();
