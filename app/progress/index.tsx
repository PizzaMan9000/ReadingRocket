import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
  const [goalMessage, setGoalMessage] = useState("Don't Give up!");
  const [goalPrimaryColor, setGoalPrimaryColor] = useState('#2895bd');
  const [goalSecondaryColor, setGoalSecondaryColor] = useState('#1B637D');
  const { dailyPagesRead, readingGoals, setReadingGoals, completed } = useProgressStore();
  const { books, bookIdsPage } = useBooksStore();

  const navigation = useNavigation();

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
        if (data) {
          console.log('🚀 ~ getReadingGoals ~ data:', data);
          setReadingGoals(parseInt(data[0].page_goal, 10));
        }
      } else {
        console.log('🚀 ~ getReadingGoals ~ error:', error);
        setIsNew(true);
      }
      setGoalsLoading(false);
    }
  };

  const enterGoalMessage = () => {
    const percentageValue = Math.floor((dailyPagesRead / readingGoals) * 100);
    console.log(percentageValue);
    if (percentageValue > 0 && percentageValue <= 25) {
      setGoalMessage("Don't give up!");
      setGoalPrimaryColor('#2895bd');
      setGoalSecondaryColor('#144A5E');
    } else if (percentageValue > 25 && percentageValue <= 50) {
      setGoalMessage('You can do it!');
      setGoalPrimaryColor('#17C3B2');
      setGoalSecondaryColor('#0E756B');
    } else if (percentageValue > 50 && percentageValue <= 75) {
      setGoalMessage('Almost there!');
      setGoalPrimaryColor('#FE6D73');
      setGoalSecondaryColor('#984145');
    } else if (percentageValue > 75 && percentageValue < 100) {
      setGoalMessage('You are so close!');
      setGoalPrimaryColor('#D3C1C3');
      setGoalSecondaryColor('#7F7475');
    } else if (percentageValue >= 100) {
      setGoalMessage('You have completed your daily streak!');
      setGoalPrimaryColor('#FFE86B');
      setGoalSecondaryColor('#998B40');
    }
  };

  const submitGoals = () => {
    router.replace('/progress/setGoals');
    setIsNew(false);
  };

  useEffect(() => {
    setDailyPages(dailyPagesRead);
    enterGoalMessage();
  }, [dailyPagesRead]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      const {
        data: { user: User },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase.from('user_books').select();
      if (error) {
        // Error handling
        console.log(error);
        return;
      }

      if (User) {
        for await (const IdsPage of bookIdsPage) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].pages_read !== IdsPage.pagesRead.toString()) {
              await supabase
                .from('user_books')
                .update({ pages_read: IdsPage.pagesRead.toString() })
                .eq('user_id', User.id)
                .eq('bookid', IdsPage.id);
            }
          }
          console.log('update complete!');
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setDailyPages(dailyPagesRead);
    getReadingGoals();
    setDisplayBooks(books);
  }, []);

  useEffect(() => {
    console.log('isNew', isNew);
  }, [isNew]);

  useEffect(() => {
    setDisplayBooks(books);
  }, [books]);

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
              backgroundColor={goalPrimaryColor}
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center">
              {completed ? (
                <Ionicons name="sparkles-sharp" size={24} color={goalSecondaryColor} />
              ) : (
                <View w={1} h={24} />
              )}
              <Text textAlign="center" color={goalSecondaryColor} fontSize={12} fontWeight={600}>
                {goalMessage}
              </Text>
              {completed ? (
                <Ionicons name="sparkles-sharp" size={24} color={goalSecondaryColor} />
              ) : (
                <View w={1} h={24} />
              )}
            </View>
          </View>
        )
      )}
      <PageDisplay />
      <Separator marginVertical={40} borderColor="#C6C6C6" />
      <Text color="#1F0418" fontSize={12} fontWeight={500}>
        In progress
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView>
          {displayBooks && displayBooks.map((item) => <BookProgress key={item.id} book={item} />)}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;
