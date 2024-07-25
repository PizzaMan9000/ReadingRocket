import { Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Input, Button, useTheme } from 'tamagui';

import BackButton from '@/components/backButton';
import { supabase } from '@/services/supabase';

const Page = () => {
  const [amountOfPages, setAmountOfPages] = useState(10);

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  const submitReadingGoals = async () => {
    try {
      await AsyncStorage.setItem('@readingGoals', amountOfPages.toString());

      const {
        data: { user: User },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_goals')
        .insert({ user_id: User?.id, page_goal: amountOfPages.toString() });
      console.log('🚀 ~ submitReadingGoals ~ error:', error);
      router.replace('/progress/');
    } catch (e) {
      console.log('🚀 ~ submitReadingGoals ~ e:', e);
    }
  };

  useEffect(() => {
    if (amountOfPages < 4) {
      setAmountOfPages(4);
    }

    if (amountOfPages >= 100) {
      setAmountOfPages(99);
    }
  }, [amountOfPages]);

  return (
    <View flex={1} paddingHorizontal={20} paddingTop={72}>
      <BackButton absolute marginLeft={20} marginTop={60} />
      <Text fontSize={35} fontWeight={500} color="#1F0318" textAlign="center" mt={40}>
        Set your goals
      </Text>
      <Text fontSize={13} color="#1F0318" textAlign="center">
        <Text fontWeight={500} textAlign="center">
          Reading Goals
        </Text>{' '}
        is designed to help track your progress and stay on top of your reading. The app will remind
        you to reach your daily page goal so you can keep moving through that captivating story (or
        tackling that informative text!).
      </Text>
      <View alignItems="center" justifyContent="center" flex={1}>
        <Text fontWeight={500}>How many pages would you like to read everyday?</Text>
        <View flexDirection="row" mt={5} alignItems="center" mb={100}>
          <Button onPress={() => setAmountOfPages(amountOfPages + 1)}>
            <Feather name="plus" size={24} color="black" />
          </Button>
          <Input
            marginHorizontal={20}
            fontSize={60}
            height={90}
            borderRadius={5}
            borderWidth={0.5}
            width={110}
            borderColor="#999999"
            textAlign="center"
            value={amountOfPages.toString()}
            onChangeText={(text) => setAmountOfPages(parseInt(text, 10))}
          />
          <Button onPress={() => setAmountOfPages(amountOfPages - 1)}>
            <Feather name="minus" size={24} color="black" />
          </Button>
        </View>
        <View
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          bc={theme.primaryColor}
          mt={10}
          paddingVertical={15}
          paddingHorizontal={50}
          borderRadius={10}
          onPress={() => submitReadingGoals()}>
          <Text color="#FFFFFF" mr={8} fontSize={20} fontWeight={800} letterSpacing={2}>
            SUBMIT
          </Text>
          <FontAwesome name="arrow-right" size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
};

export default Page;
