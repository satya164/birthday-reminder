import * as React from 'react';
import {
  SectionList,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BirthdayCard from './BirthdayCard';
import ProfilesContext from './ProfilesContext';
import TextInput from './TextInput';
import useDate from './useDate';
import { Profile, StackParamList } from './types';

type Category = 'today' | 'tomorrow' | 'week' | 'month' | 'others';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;

type Props = {
  navigation: NativeStackNavigationProp<StackParamList, 'BirthdayList'>;
};

export default function BirthdayList({ navigation }: Props) {
  const { colors } = useTheme();
  const date = useDate(MINUTE);
  const { profiles } = React.useContext(ProfilesContext);
  const [query, setQuery] = React.useState('');

  const categories = profiles
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .reduce<Record<Category, Profile[]>>(
      (acc, curr) => {
        const birthday = new Date(curr.birthday);

        birthday.setUTCFullYear(date.getUTCFullYear());

        const diff = birthday.getTime() - date.getTime();

        if (
          birthday.getMonth() === date.getMonth() &&
          birthday.getDay() === date.getDay()
        ) {
          acc.today.push(curr);
        } else if (
          birthday.getMonth() === date.getMonth() &&
          birthday.getDay() - 1 === date.getDay()
        ) {
          acc.tomorrow.push(curr);
        } else if (diff < 0) {
          acc.others.push(curr);
        } else if (diff <= WEEK) {
          acc.week.push(curr);
        } else if (diff <= MONTH) {
          acc.month.push(curr);
        } else {
          acc.others.push(curr);
        }

        return acc;
      },
      { today: [], tomorrow: [], week: [], month: [], others: [] }
    );

  const sections = Object.entries(categories)
    .map(([key, value]) => ({
      id: key as Category,
      data: value.sort((a, b) => {
        if (a.birthday > b.birthday) return 1;
        if (b.birthday > a.birthday) return -1;
        return 0;
      }),
    }))
    .filter(({ data }) => Boolean(data.length));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.select({
          android: (
            <Appbar.Action
              icon="account-plus"
              onPress={() => navigation.navigate('AddBirthday')}
            />
          ),
          ios: (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('AddBirthday')}
            >
              <MaterialCommunityIcons name="account-plus" size={20} />
            </TouchableOpacity>
          ),
        }),
    });
  }, [navigation]);

  return (
    <React.Fragment>
      <SectionList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <TextInput
            autoFocus={
              // SectionList remounts the text input when content changes
              // Focus it back on remount as an workaround
              //https://github.com/facebook/react-native/issues/23400
              Boolean(query)
            }
            placeholder="Find birthday"
            value={query}
            onChangeText={setQuery}
          />
        }
        renderItem={({ item }) => (
          <BirthdayCard
            profile={item}
            onPress={() =>
              navigation.navigate('EditProfile', {
                profile: item,
                mode: 'edit',
              })
            }
          />
        )}
        renderSectionHeader={({ section: { id } }) => {
          const titles: Record<Category, string> = {
            today: 'Today',
            tomorrow: 'Tomorrow',
            week: 'This week',
            month: 'This month',
            others: 'Later',
          };

          return (
            <Text
              style={[styles.header, { backgroundColor: colors.background }]}
            >
              {titles[id as Category]}
            </Text>
          );
        }}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
  header: {
    padding: 8,
  },
  button: {
    padding: Platform.select({ default: 10, android: 16 }),
    marginHorizontal: 8,
    borderRadius: 48,
  },
});
