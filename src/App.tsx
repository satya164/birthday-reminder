import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import {
  getAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import {
  Provider,
  DefaultTheme as PaperDefaultTheme,
  Appbar,
} from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { useFonts } from '@use-expo/font';
import { nanoid } from 'nanoid/non-secure';
import BirthdayList from './BirthdayList';
import AddBirthday from './AddBirthday';
import EditProfile from './EditProfile';
import IOSButton from './IOSButton';
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

  React.useEffect(() => {
    const syncNotifications = async () => {
      const notifications = await getAllScheduledNotificationsAsync();

      console.log({ notifications });

      try {
        await Promise.all(
          profiles.map((profile) =>
            scheduleNotificationAsync({
              identifier: profile.id,
              content: {
                title: `🎂 Today is ${profile.name}'s birthday!`,
                body: 'Wish him all the best',
                sound: true,
              },
              trigger: {
                seconds: 60,
              },
            })
          )
        );
      } catch (err) {
        console.warn(err);
      }
    };

    syncNotifications();
  }, [profiles]);

  if (!fontsLoaded || isLoading) {
    return <AppLoading />;
  }

  return (
    <Provider theme={PaperTheme}>
      <NavigationContainer>
        <ProfilesContext.Provider value={profilesContext}>
          <Stack.Navigator
            mode="modal"
            screenOptions={({ navigation, route }) => {
              const isFirstScreen =
                navigation.dangerouslyGetState().routes.indexOf(route) === 0;

              return {
                headerStyle: {
                  elevation: 0,
                  borderBottomWidth: Platform.select({
                    ios: undefined,
                    default: StyleSheet.hairlineWidth,
                  }),
                },
                headerTitleStyle: { fontFamily: 'Lato-Medium' },
                headerLeft: isFirstScreen
                  ? undefined
                  : ({ onPress }) =>
                      Platform.select({
                        ios: <IOSButton onPress={onPress}>Cancel</IOSButton>,
                        default: (
                          <Appbar.Action icon="close" onPress={onPress} />
                        ),
                      }),
                // @ts-ignore
                ...Platform.select({
                  ios: {
                    cardOverlayEnabled: true,
                    headerStatusBarHeight: isFirstScreen ? undefined : 0,
                    ...TransitionPresets.ModalPresentationIOS,
                  },
                  default: TransitionPresets.ScaleFromCenterAndroid,
                }),
              };
            }}
          >
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
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={({ route }) => ({
                title:
                  route.params.mode === 'edit' ? 'Edit profile' : 'Add profile',
              })}
            />
          </Stack.Navigator>
        </ProfilesContext.Provider>
      </NavigationContainer>
    </Provider>
  );
}

enableScreens();
