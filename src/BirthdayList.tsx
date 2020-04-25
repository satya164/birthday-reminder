import * as React from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import BirthdayCard from './BirthdayCard';
import ProfilesContext from './ProfilesContext';
import useDate from './useDate';
import { Profile } from './types';

type Category = 'today' | 'week' | 'month' | 'others';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;

export default function BirthdayList() {
  const { colors } = useTheme();
  const date = useDate(MINUTE);
  const { profiles } = React.useContext(ProfilesContext);

  const categories = profiles.reduce<Record<Category, Profile[]>>(
    (acc, curr) => {
      const birthday = new Date(curr.birthday);

      birthday.setUTCFullYear(date.getUTCFullYear());

      const diff = birthday.getTime() - date.getTime();

      if (diff === 0) {
        acc.today.push(curr);
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
    { today: [], week: [], month: [], others: [] }
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

  return (
    <SectionList
      contentContainerStyle={[
        styles.content,
        { backgroundColor: colors.background },
      ]}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BirthdayCard profile={item} />}
      renderSectionHeader={({ section: { id } }) => {
        const titles: Record<Category, string> = {
          today: 'Today',
          week: 'This week',
          month: 'This month',
          others: 'In the future',
        };

        return (
          <Text style={[styles.header, { backgroundColor: colors.background }]}>
            {titles[id as Category]}
          </Text>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
  header: {
    padding: 8,
  },
});
