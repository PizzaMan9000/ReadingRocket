import notifee, {
  AuthorizationStatus,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';
import { Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';

import { queryClient } from '@/services/clients/queryClient';
import { supabase } from '@/services/clients/supabase';
import useBooksStore from '@/store/booksStore';
import useGlobalStore from '@/store/globalStore';
import useProgressStore from '@/store/progressStore';
import useStreakStore from '@/store/streakStore';
import config from '@/tamagui.config';

Sentry.init({
  dsn: 'https://c993385f6aa3496b99e475b8b1e07530@o4507616346308608.ingest.us.sentry.io/4507616365051904',
  debug: true,
});

const InitalLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { bookIdsPage } = useBooksStore();
  const { setDailyPagesRead, readingGoals } = useProgressStore();
  const { setStreakDaysCount, userJoinDay, setUserJoinDay, streakDaysCount } = useStreakStore();
  const { notificationsOn } = useGlobalStore();
  const [appState, setAppState] = useState(AppState.currentState);

  const segments = useSegments();
  const router = useRouter();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    // setBooks([]);

    async function setupNotifications() {
      // Request permissions first
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        // Schedule the daily notification
        await scheduleDailyNotification();
      } else {
        console.log('User declined notification permissions');
      }
    }

    setupNotifications(); // Call the async function to set up notifications
  }, []); // Empty dependency array means this effect runs once on mount

  async function scheduleDailyNotification() {
    if (notificationsOn === false) {
      return;
    }

    await notifee.createChannel({
      id: 'daily-reminder',
      name: 'Daily Reminder',
      importance: AndroidImportance.HIGH,
    });

    const date = new Date();
    date.setHours(8);
    date.setMinutes(0);
    date.setSeconds(0);

    // If the time has already passed today, set it for tomorrow
    if (date.getTime() <= Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    await notifee.createTriggerNotification(
      {
        title: 'Daily Reminder',
        body: 'Don’t forget to check out today’s updates!',
        android: {
          channelId: 'daily-reminder',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(), // set the notification time
        repeatFrequency: RepeatFrequency.DAILY, // repeat daily
      }
    );
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
      console.log('AppState:', nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('🚀 ~ InitalLayout ~ readingGoals:', readingGoals);
  }, [readingGoals]);

  const saveUserBooks = async () => {
    console.log('something is happening');

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
  };

  useEffect(() => {
    if (appState === 'inactive' || appState === 'background') {
      saveUserBooks();
    }
  }, [appState]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const getJoinDay = async () => {
    const today = new Date().getDay();
    console.log('🚀 ~ getJoinDay ~ today:', today);
    if (today > userJoinDay || (today === 0 && userJoinDay === 6)) {
      const newDay = today;
      console.log('🚀 ~ getJoinDay ~ newDay:', newDay);
      setUserJoinDay(newDay);
      setDailyPagesRead(0);

      console.log('Hello');
      console.log('🚀 ~ getJoinDay ~ userJoinDay:', userJoinDay);
      console.log('🚀 ~ getJoinDay ~ today:', today);

      const dayDifference = today - userJoinDay;
      console.log('🚀 ~ getJoinDay ~ dayDifference:', dayDifference);
      if (dayDifference === 1 || dayDifference === -6) {
        console.log('🚀 ~ getJoinDay ~ streakDaysCount:', streakDaysCount);
        if (streakDaysCount) {
          const newStreakDays = streakDaysCount + 1;
          setStreakDaysCount(newStreakDays);
        } else {
          console.log('hello2222');
          setStreakDaysCount(0);
        }
      } else {
        setStreakDaysCount(0);
      }
    }
  };

  useEffect(() => {
    console.log('ROCKET ROCKET', userJoinDay);
  }, [userJoinDay]);

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
    } else if (data.length === 0 && User) {
      router.replace('/forum/userForum');
      console.log('Transferring to the forums');
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

    //setDailyPagesRead(2);

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

export default Sentry.wrap(InitalLayout);
