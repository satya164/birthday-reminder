import * as React from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import BirthdayCard from './BirthdayCard';
import SectionDivider from './SectionDivider';

const hasBirthday = (contact: Contacts.Contact) =>
  contact.birthday && contact.birthday.day && contact.birthday.month;

const ContactCard = React.memo(({ contact }: { contact: Contacts.Contact }) => {
  return (
    <BirthdayCard
      profile={{
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
      }}
    />
  );
});

export default function AddBirthday() {
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
        style={styles.input}
        placeholder="Type a name"
      />
      {name ? (
        <TouchableRipple
          onPress={() => {}}
          style={[styles.create, { backgroundColor: colors.primary }]}
        >
          <>
            <Ionicons name="ios-add-circle" size={24} style={styles.icon} />
            <Text style={styles.label}>Add &quot;{name}&quot;</Text>
          </>
        </TouchableRipple>
      ) : null}
      {data.length ? <SectionDivider label="Or select from contacts" /> : null}
      <FlatList
        data={data}
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  create: {
    margin: 8,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
  },
  icon: {
    color: 'white',
    marginRight: 16,
  },
  input: {
    backgroundColor: 'white',
    margin: 8,
    padding: 12,
    borderRadius: 5,
  },
});
