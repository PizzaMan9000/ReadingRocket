import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, useTheme, Separator, ScrollView, Button, Spinner } from 'tamagui';

import BookProgress from '@/components/bookProgress';
import Header from '@/components/header';
import PageDisplay from '@/components/pageDisplay';
import { IDBook } from '@/interfaces/api/bookidApiResult';
import { supabase } from '@/services/clients/supabase';
import useBooksStore from '@/store/booksStore';
import useProgressStore from '@/store/progressStore';

const Page = () => {
  const [displayBooks, setDisplayBooks] = useState<IDBook[]>();
  const [isNew, setIsNew] = useState<boolean>();
  const [dailyPages, setDailyPages] = useState<number>(0);
  const [goalsLoading, setGoalsLoading] = useState<boolean>();
  const { dailyPagesRead, readingGoals } = useProgressStore();
  const { books } = useBooksStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  const getReadingGoals = async () => {
    if (readingGoals !== 0) {
      setIsNew(false);
    } else {
      setGoalsLoading(true);
      const {
        data: { user: User },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase.from('user_goals').select().eq('user_id', User?.id);
      if (data?.length !== 0) {
        setIsNew(false);
      } else {
        console.log('🚀 ~ getReadingGoals ~ error:', error);
        setIsNew(true);
      }
      setGoalsLoading(false);
    }
  };

  const saveDailyPages = async () => {
    try {
      await AsyncStorage.setItem('@dailyPagesRead', dailyPages.toString());
    } catch (e) {
      console.error('🚀 ~ saveDailyPages ~ e:', e);
    }
  };

  const submitGoals = () => {
    router.replace('/progress/setGoals');
    setIsNew(false);
  };

  useEffect(() => {
    if (dailyPages < 0) {
      setDailyPages(0);
    }
    saveDailyPages();
  }, [dailyPages]);

  useEffect(() => {
    setDailyPages(dailyPagesRead);
    getReadingGoals();
    setDisplayBooks(books);
  }, []);

  useEffect(() => {
    console.log('isNew', isNew);
  }, [isNew]);

  return (
    <View paddingHorizontal={20} paddingTop={72} flex={1}>
      <Header
        headerValue="Your progress"
        backMarginTop={0}
        backMarginLeft={0}
        backAbsolute={false}
      />
      {goalsLoading && (
        <View
          w={353}
          h={148}
          borderRadius={5}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          bc={theme.complementaryColor}
          mt={30}>
          <Spinner size="large" color="#6247AA" />
        </View>
      )}
      {isNew && !goalsLoading ? (
        <LinearGradient
          colors={['#6247AA', '#A06CD5']}
          style={{
            width: 380,
            height: 148,
            borderRadius: 5,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button backgroundColor={theme.complementaryColor} onPress={submitGoals}>
            <Text color={theme.primaryColor} fontWeight={500}>
              Set your goals
            </Text>
          </Button>
        </LinearGradient>
      ) : (
        !goalsLoading && (
          <View
            mt={20}
            w="100%"
            borderRadius={5}
            backgroundColor={theme.complementaryColor}
            padding={20}
            alignItems="center"
            justifyContent="center">
            {dailyPages ? (
              <Text color="#6247AA" textAlign="center" fontSize={64} fontWeight={600}>
                {dailyPages}
              </Text>
            ) : (
              <Text color="#6247AA" textAlign="center" fontSize={64} fontWeight={600}>
                0
              </Text>
            )}
            <Text color="#6247AA" textAlign="center" fontSize={20} fontWeight={600}>
              Pages read
            </Text>
            <View
              mt={22}
              w="100%"
              padding={10}
              borderRadius={5}
              backgroundColor="#FFE86B"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center">
              <Ionicons name="sparkles-sharp" size={24} color="#866E0D" />
              <Text textAlign="center" color="#866E0D" fontSize={12} fontWeight={600}>
                You have completed your daily streak!
              </Text>
              <Ionicons name="sparkles-sharp" size={24} color="#866E0D" />
            </View>
          </View>
        )
      )}
      <PageDisplay />
      <Separator marginVertical={40} borderColor="#C6C6C6" />
      <Text color="#1F0418" fontSize={12} fontWeight={500}>
        In progress
      </Text>
      <ScrollView>
        {displayBooks &&
          displayBooks.map((item) => (
            <BookProgress key={item.id} book={item} setBooks={setDisplayBooks} />
          ))}
      </ScrollView>
    </View>
  );
};

export default Page;
