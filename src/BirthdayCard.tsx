import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import Row from './Row';
import { Profile } from './types';

type Props = {
  profile: Omit<Profile, 'birthday'> & { birthday?: string };
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default React.memo(function BirthdayCard({ profile }: Props) {
  const birthday = profile.birthday ? new Date(profile.birthday) : undefined;

  return (
    <View style={styles.card}>
      <Row>
        {profile.avatar ? (
          <Avatar.Image
            source={{ uri: profile.avatar }}
            size={48}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            label={profile.name[0]}
            size={48}
            style={styles.avatar}
          />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.birthday}>
            {birthday
              ? `${birthday.getDate()} ${months[birthday.getMonth()]}`
              : '—'}
          </Text>
        </View>
      </Row>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 5,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Lato-Medium',
    marginVertical: 8,
  },
  birthday: {
    fontSize: 14,
    opacity: 0.5,
  },
  content: {
    paddingVertical: 8,
  },
  avatar: {
    margin: 16,
  },
});
