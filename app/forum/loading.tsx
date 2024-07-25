import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Text, Progress, useTheme } from 'tamagui';

import { pageAndID } from '@/interfaces/app/forumInterface';
import { supabase } from '@/services/supabase';

const Page = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const timeout1 = setTimeout(async () => {
      setText('Getting your results...');
      try {
        const forumData = await AsyncStorage.getItem('@forumData');
        if (forumData != null) {
          const forumResult = await supabase
            .from('user_forums')
            .insert(JSON.parse(forumData))
            .select()
            .single();
          console.log('🚀 ~ userForum ~ bookResult:', forumResult);
        }
      } catch (e) {
        // Do error handling
        console.log(e);
      } finally {
        setProgress(20);
      }
    }, 1000);
    const timeout2 = setTimeout(async () => {
      setText('Saving your results...');

      try {
        const {
          data: { user: User },
        } = await supabase.auth.getUser();

        const bookData = await AsyncStorage.getItem('@currentPagesBookIds');

        if (bookData != null) {
          const bookIds = JSON.parse(bookData); // Parse book IDs into an array

          // Use map to create an array of promises for book insertions
          const bookInsertionPromises = bookIds.map(async (pageId: pageAndID) => {
            console.log(' ~ timeout2 ~ id:', pageId.id);
            try {
              if (!pageId.hasOwnProperty('pageCount')) {
                pageId.pageCount = 100;
              }

              await AsyncStorage.removeItem('@userBooks');

              return await supabase
                .from('user_books')
                .insert({
                  user_id: User?.id,
                  bookid: pageId.id,
                  amount_of_pages: pageId.pageCount,
                  pages_read: pageId.pagesRead,
                })
                .select()
                .single();
            } catch (error) {
              console.error('Error saving book:', error);
              // Handle specific errors here if needed
              return null; // Or handle the error differently (e.g., throw)
            }
          });

          // Handle potential errors after all insertions are attempted
          const bookResults = await Promise.all(bookInsertionPromises);
          console.log(' ~ bookResults:', bookResults); // Array of results or errors
        }
      } catch (e) {
        console.error('Error fetching user or saving books:', e);
        // Handle general errors here
      } finally {
        setProgress(50);
      }
    }, 1000);
    const timeout3 = setTimeout(() => {
      setText('Calculating your tools...');
      setProgress(70);
    }, 7000);
    const timeout4 = setTimeout(async () => {
      setText('Fetching your tools...');
      try {
        await AsyncStorage.removeItem('@currentBookIds');
      } catch (e) {
        console.log(e);
      } finally {
        setProgress(100);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, []);

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  return (
    <LinearGradient
      colors={['#6247AA', '#36105c']}
      end={{ x: 0.9, y: 0.7 }}
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>{text}</Text>
      <Progress size="$3" backgroundColor="#290133" w="80%" value={progress}>
        <Progress.Indicator backgroundColor={theme.primaryColor} animation="bouncy" />
      </Progress>
    </LinearGradient>
  );
};

export default Page;
