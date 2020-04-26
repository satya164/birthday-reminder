import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BirthdayCard from './BirthdayCard';
import SectionDivider from './SectionDivider';
import LargeButton from './LargeButton';
import TextInput from './TextInput';
import { StackParamList } from './types';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'AddBirthday'>;
};

const hasBirthday = (contact: Contacts.Contact) =>
  contact.birthday && contact.birthday.day && contact.birthday.month;

const ContactCard = React.memo(({ contact }: { contact: Contacts.Contact }) => {
  const navigation = useNavigation<
    StackNavigationProp<StackParamList, 'AddBirthday'>
  >();

  const profile = {
    id: contact.id,
    name: contact.name,
    birthday:
      contact.birthday && contact.birthday.day && contact.birthday.month
        ? new Date(
            contact.birthday.year || 1921,
            contact.birthday.month,
            contact.birthday.day
          ).toUTCString()
        : undefined,
    avatar: contact.image?.uri,
  };

  return (
    <BirthdayCard
      profile={profile}
      onPress={() =>
        navigation.replace('EditProfile', { profile, mode: 'create' })
      }
    />
  );
});

export default function AddBirthday({ navigation }: Props) {
  const { colors } = useTheme();
  const [name, setName] = React.useState('');
  const [contacts, setContacts] = React.useState<Contacts.Contact[]>([]);

  React.useEffect(() => {
    const loadContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Birthday, Contacts.Fields.Image],
        });

        setContacts(data);
      }
    };

    loadContacts();
  }, []);

  const data = contacts
    .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
    .sort((a, b) => {
      if (hasBirthday(a) && !hasBirthday(b)) {
        return -1;
      }

      if (hasBirthday(b) && !hasBirthday(a)) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        autoFocus
        onChangeText={setName}
        value={name}
        placeholder="Type a name"
      />
      {name ? (
        <LargeButton
          icon="ios-add-circle"
          onPress={() => {
            navigation.replace('EditProfile', {
              profile: { name },
              mode: 'create',
            });
          }}
          label={`Add "${name}"`}
        />
      ) : null}
      {data.length ? <SectionDivider label="Or select from contacts" /> : null}
      <FlatList
        data={data}
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
