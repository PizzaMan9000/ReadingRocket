import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';

import { queryClient } from '@/services/queryClient';
import { supabase } from '@/services/supabase';
import config from '@/tamagui.config';

const InitalLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const getJoinDay = async () => {
    try {
      const storedDay = await AsyncStorage.getItem('@userJoinDay');
      if (storedDay) {
        // Check if stored day is older than today
        const today = new Date().getDay(); // 0 (Sunday) - 6 (Saturday)
        const storedDayNum = parseInt(storedDay, 10);
        if (today > storedDayNum || (today === 0 && storedDayNum === 6)) {
          const newDay = today;
          await AsyncStorage.setItem('@userJoinDay', newDay.toString());
          await AsyncStorage.setItem('@dailyPagesRead', '0');
          const dayDifference = today - storedDayNum;
          if (dayDifference === 1 || dayDifference === -6) {
            const rawStreakDays = await AsyncStorage.getItem('@streakDaysCount');
            if (rawStreakDays) {
              const streakDays: number = JSON.parse(rawStreakDays);
              const newStreakDays = streakDays + 1;

              await AsyncStorage.setItem('@streakDaysCount', newStreakDays.toString());
            } else {
              await AsyncStorage.setItem('@streakDaysCount', '0');
            }
          } else {
            await AsyncStorage.setItem('@streakDaysCount', '0');
          }
        }
      } else {
        const today = new Date().getDay();
        await AsyncStorage.setItem('@userJoinDay', today.toString());
        await AsyncStorage.setItem('@dailyPagesRead', '0');
        await AsyncStorage.setItem('@streakDaysCount', '0');
      }
    } catch (error) {
      console.error('Error getting join day:', error);
    }
  };

  const checkTransferForums = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('user_forums').select('user_id');

    if (error) {
      console.log('🚀 ~ checkTransferForums ~ error:', error);
      return;
    }
    console.log(data);
    console.log(User?.id);

    if (data && User) {
      try {
        for (const row of data) {
          if (row['user_id'] === User?.id) {
            router.replace('/(auth)/');
            console.log('Transferring to home');
            break;
          } else {
            router.replace('/forum/userForum');
            console.log('Transferring to the forums');
          }
        }
      } catch (e) {
        console.log('error occured', e);
      }
    }
  };

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      router.replace('/loadingScreen');
      console.log('here');
      checkTransferForums();
    } else if (!session) {
      router.replace('/');
    }
  }, [initialized, session]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setInitialized(true);
    });

    getJoinDay();

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <TamaguiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Theme name="erudito">
          <Slot />
        </Theme>
      </QueryClientProvider>
    </TamaguiProvider>
  );
};

export default InitalLayout;
