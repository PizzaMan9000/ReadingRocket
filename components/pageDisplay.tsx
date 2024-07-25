import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { memo, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, useTheme, Progress } from 'tamagui';

import { supabase } from '@/services/supabase';

const PageDisplay = () => {
  const [readingGoals, setReadingGoals] = useState<string>();
  const [streak, setStreak] = useState<number>();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const getReadingGoals = async () => {
    try {
      const fetchedReadingGoals = await AsyncStorage.getItem('@readingGoals');
      if (fetchedReadingGoals) {
        setReadingGoals(fetchedReadingGoals);
      } else {
        const {
          data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('user_goals').select().eq('user_id', User?.id);
        if (data) {
          setReadingGoals(data[0].page_goal);
        } else {
          console.log('🚀 ~ getReadingGoals ~ error:', error);
        }
      }
    } catch (e) {
      console.log('🚀 ~ getReadingGoals ~ error:', e);
    }
  };

  const getStreak = async () => {
    try {
      const rawStreakCount = await AsyncStorage.getItem('@streakDaysCount');
      if (rawStreakCount) {
        const streakCount = parseInt(rawStreakCount, 10);
        setStreak(streakCount);
      } else {
        console.log('manually set streak');
        setStreak(0);
      }
    } catch (e) {
      throw new Error(`🚀 ~ getStreak ~ e: ${e}`);
    }
  };

  useEffect(() => {
    getReadingGoals();
    getStreak();
  }, []);

  return (
    <View>
      <View flexDirection="row" mt={15} alignItems="center">
        <View flexDirection="row" alignItems="center" flex={1}>
          <Feather name="target" size={14} color="black" />
          {readingGoals ? (
            <Text ml={6} fontSize={12} fontWeight={500}>
              <Text fontWeight={700}>Goal: </Text> {readingGoals} pages daily
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
      </View>
      <View mt={14}>
        <View flexDirection="row">
          {readingGoals ? (
            <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
              6/{readingGoals} pages
            </Text>
          ) : (
            <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
              6/10 pages
            </Text>
          )}
          <Text color={theme.primaryColor} fontSize={12} fontWeight={600}>
            60%
          </Text>
        </View>
        <Progress size="$3" backgroundColor={theme.complementaryColorTwo} value={50} mt={2}>
          <Progress.Indicator
            backgroundColor={theme.primaryColor}
            animation="bouncy"
            borderTopRightRadius={100}
            borderBottomRightRadius={100}
          />
        </Progress>
      </View>
    </View>
  );
};

export default memo(PageDisplay);
