import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, useTheme, Separator, ScrollView, Button } from 'tamagui';

import BookProgress from '@/components/bookProgress';
import Header from '@/components/header';
import PageDisplay from '@/components/pageDisplay';
import { IDBook } from '@/interfaces/api/bookidApiResult';
import { supabase } from '@/services/supabase';

const Page = () => {
  const [books, setBooks] = useState<IDBook[]>();
  const [isNew, setIsNew] = useState<boolean>();
  const [dailyPages, setDailyPages] = useState<number>(0);

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  const getDailyPagesRead = async () => {
    try {
      const dailyPagesRead = await AsyncStorage.getItem('@dailyPagesRead');
      if (dailyPagesRead) {
        console.log('something found!');
        setDailyPages(parseInt(dailyPagesRead, 10));
      } else {
        // Error handling
        console.log('Error found!');
      }
    } catch (e) {
      console.log('🚀 ~ getDailyPagesRead ~ e:', e);
    }
  };

  const getReadingGoals = async () => {
    try {
      const readingGoals = await AsyncStorage.getItem('@readingGoals');
      if (readingGoals) {
        setIsNew(false);
      } else {
        const {
          data: { user: User },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('user_goals').select().eq('user_id', User?.id);
        if (data) {
          setIsNew(false);
        } else {
          console.log('🚀 ~ getReadingGoals ~ error:', error);
          setIsNew(true);
        }
      }
    } catch (e) {
      console.log('🚀 ~ getReadingGoals ~ e:', e);
    }
  };

  const getBooks = async () => {
    try {
      const rawBooks = await AsyncStorage.getItem('@userBooks');
      if (rawBooks) {
        const parsedBooks = JSON.parse(rawBooks);
        setBooks(parsedBooks);
      } else {
        // Do some error handling later
        console.log('rawBooks is null');
      }
    } catch (e) {
      console.log('🚀 ~ getBooks ~ e:', e);
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
    getDailyPagesRead();
    getReadingGoals();
    getBooks();
  }, []);

  return (
    <View paddingHorizontal={20} paddingTop={72} flex={1}>
      <Header
        headerValue="Your progress"
        backMarginTop={0}
        backMarginLeft={0}
        backAbsolute={false}
      />
      {isNew ? (
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
      )}
      <PageDisplay />
      <Separator marginVertical={40} borderColor="#C6C6C6" />
      <Text color="#1F0418" fontSize={12} fontWeight={500}>
        In progress
      </Text>
      <ScrollView>
        {books &&
          books.map((item) => (
            <BookProgress
              key={item.id}
              book={item}
              setBooks={setBooks}
              setDailyPages={setDailyPages}
              dailyPages={dailyPages}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default Page;
