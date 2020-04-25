import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import Row from './Row';
import { Profile } from './types';

type Props = {
  profile: Profile;
};

const { format } = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: '2-digit',
});

export default React.memo(function BirthdayCard({ profile: birthday }: Props) {
  return (
    <View style={styles.card}>
      <Row>
        <Avatar.Image
          source={{ uri: birthday.avatar }}
          size={48}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{birthday.name}</Text>
          <Text style={styles.birthday}>
            {format(new Date(birthday.birthday))}
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
