import { Feather } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, useTheme, Progress } from 'tamagui';

import { supabase } from '@/services/clients/supabase';
import useProgressStore from '@/store/progressStore';
import useStreakStore from '@/store/streakStore';

const PageDisplay = () => {
  const [fetchedReadingGoals, setFetchedReadingGoals] = useState<string>('');
  const [streak, setStreak] = useState<number>();
  const [readingGoalPercentage, setReadingGoalPercentage] = useState('');
  const { readingGoals, dailyPagesRead, completed, setCompleted, setReadingGoals } =
    useProgressStore();
  const { streakDaysCount } = useStreakStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const getReadingGoals = async () => {
    try {
      if (readingGoals) {
        console.log('IYVDOJWIPWJP');
        setFetchedReadingGoals(readingGoals.toString());
      } else {
        const {
          data: { user: User },
        } = await supabase.auth.getUser();

        console.log('IYVDOJWIPWJeeeeeeeeeP');

        const { data, error } = await supabase.from('user_goals').select().eq('user_id', User?.id);
        if (data) {
          setFetchedReadingGoals(data[0].page_goal);
          setReadingGoals(parseInt(data[0].page_goal, 10));
          console.log('SETTING READING GOALS', readingGoals);
        } else {
          console.log('🚀 ~ getReadingGoals ~ error:', error);
        }
      }
    } catch (e) {
      console.log('🚀 ~ getReadingGoals ~ error:', e);
    }
  };

  useEffect(() => {
    getReadingGoals();
    if (streakDaysCount !== null) {
      setStreak(streakDaysCount);
    }
  }, []);

  useEffect(() => {
    if (dailyPagesRead.toString() === fetchedReadingGoals) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
    console.log('hello9');

    if (dailyPagesRead > parseInt(fetchedReadingGoals, 10)) {
      setReadingGoalPercentage('100');
    } else {
      setReadingGoalPercentage(
        Math.floor((dailyPagesRead / parseInt(fetchedReadingGoals, 10)) * 100).toString()
      );
      console.log('HHSJJAJA', readingGoalPercentage);
    }
  }, [dailyPagesRead]);

  useEffect(() => {
    if (dailyPagesRead > parseInt(fetchedReadingGoals, 10)) {
      setReadingGoalPercentage('100');
    } else {
      setReadingGoalPercentage(
        Math.floor((dailyPagesRead / parseInt(fetchedReadingGoals, 10)) * 100).toString()
      );
      console.log('HHSJJAJA', readingGoalPercentage);
    }
  }, [dailyPagesRead, fetchedReadingGoals]);

  return (
    <View>
      <View flexDirection="row" mt={15} alignItems="center">
        <View flexDirection="row" alignItems="center" flex={1}>
          <Feather name="target" size={14} color="black" />
          {fetchedReadingGoals ? (
            <Text ml={6} fontSize={12} fontWeight={500}>
              <Text fontWeight={700}>Goal: </Text> {fetchedReadingGoals} pages daily
            </Text>
          ) : (
            <Text ml={6} fontSize={12} fontWeight={500}>
              <Text fontWeight={700}>Goal: </Text> Not set
            </Text>
          )}
        </View>
        <View
          w={65}
          h={24}
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          mr={5}
          backgroundColor="#FFDBBB"
          borderRadius={5}>
          <Image
            source={{
              uri: 'https://img.icons8.com/?size=100&id=QV5JEtrTP6nH&format=png&color=000000',
            }}
            style={{ width: 14, height: 14, marginLeft: 4, marginRight: 3 }}
          />
          {streak ? (
            <Text color="#495240" fontSize={10} fontWeight={600}>
              {streak} Days
            </Text>
          ) : (
            <Text color="#495240" fontSize={10} fontWeight={600}>
              0 Days
            </Text>
          )}
        </View>
        {completed ? (
          <View
            w={58}
            h={24}
            alignItems="center"
            justifyContent="center"
            backgroundColor="#77DD77"
            borderRadius={5}
            paddingHorizontal={5}>
            <Text color="#06402B" fontSize={10} fontWeight={600} lineHeight={24}>
              Completed
            </Text>
          </View>
        ) : (
          <View
            w={58}
            h={24}
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.complementaryColor}
            borderRadius={5}>
            <Text color={theme.primaryColor} fontSize={10} fontWeight={600} lineHeight={24}>
              Ongoing
            </Text>
          </View>
        )}
      </View>
      <View mt={14}>
        <View flexDirection="row">
          {fetchedReadingGoals ? (
            <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
              {dailyPagesRead}/{fetchedReadingGoals} pages
            </Text>
          ) : (
            <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
              {dailyPagesRead}/10 pages
            </Text>
          )}
          {fetchedReadingGoals && (
            <Text color={theme.primaryColor} fontSize={12} fontWeight={600}>
              {readingGoalPercentage}%
            </Text>
          )}
        </View>
        {fetchedReadingGoals && (
          <Progress
            size="$3"
            backgroundColor={theme.complementaryColorTwo}
            value={parseInt(readingGoalPercentage, 10)}
            mt={2}>
            <Progress.Indicator
              backgroundColor={theme.primaryColor}
              animation="bouncy"
              borderTopRightRadius={100}
              borderBottomRightRadius={100}
            />
          </Progress>
        )}
      </View>
    </View>
  );
};

export default memo(PageDisplay);
