import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TouchableRipple, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TextInput from './TextInput';
import TextInputLabel from './TextInputLabel';
import IOSButton from './IOSButton';
import LargeButton from './LargeButton';
import ProfilesContext from './ProfilesContext';
import { StackParamList } from './types';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'EditProfile'>;
  route: RouteProp<StackParamList, 'EditProfile'>;
};

export default function EditProfile({ navigation, route }: Props) {
  const { profile } = route.params;

  const { add: addProfile, update: updateProfile } = React.useContext(
    ProfilesContext
  );

  const [birthday, setBirthday] = React.useState(
    profile.birthday ? new Date(profile.birthday) : new Date()
  );

  const [isBirthdayPickerShown, setIsBirthdayPickerShown] = React.useState(
    false
  );

  const { colors } = useTheme();
  const [name, setName] = React.useState(profile.name || '');
  const [number, setNumber] = React.useState(profile.phones?.[0] || '');

  const onSave = React.useCallback(() => {
    if (route.params.mode === 'edit' && profile.id) {
      updateProfile(profile.id, {
        name,
        birthday: birthday.toUTCString(),
        phones: [number],
      });
    } else {
      addProfile({
        avatar: profile.avatar,
        name,
        birthday: birthday.toUTCString(),
        phones: [number],
      });
    }

    navigation.goBack();
  }, [
    addProfile,
    birthday,
    name,
    navigation,
    number,
    profile.avatar,
    profile.id,
    route.params.mode,
    updateProfile,
  ]);

  React.useLayoutEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerRight: () => <IOSButton onPress={onSave}>Done</IOSButton>,
      });
    }
  }, [navigation, onSave]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        autoFocus
        label="Name"
        onChangeText={setName}
        value={name}
        placeholder="Type a name"
      />
      <View style={styles.container}>
        <TextInputLabel>Birthday</TextInputLabel>
        {Platform.OS === 'android' ? (
          <TouchableRipple
            style={styles.button}
            onPress={() => setIsBirthdayPickerShown(true)}
          >
            <Text>
              {Platform.select({
                // FIXME: `toLocaleString` doesn't work on Android
                android: `${
                  birthday.toDateString().split(' ')[1]
                } ${birthday.getDate()}, ${birthday.getFullYear()}`,
                default: birthday.toLocaleString('en-us', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                }),
              })}
            </Text>
          </TouchableRipple>
        ) : null}
        {(Platform.OS === 'android' ? isBirthdayPickerShown : true) ? (
          <DateTimePicker
            value={birthday}
            display="default"
            onChange={(_, selectedDate) => {
              const currentDate = selectedDate || birthday;
              setIsBirthdayPickerShown(Platform.OS === 'ios');
              setBirthday(currentDate);
            }}
          />
        ) : null}
      </View>
      <TextInput
        autoFocus
        label="Phone number"
        onChangeText={setNumber}
        value={number}
        placeholder="Type a phone number"
      />
      {Platform.OS !== 'ios' ? (
        <LargeButton
          icon="ios-checkmark-circle"
          label="Save"
          onPress={onSave}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
  },
});
