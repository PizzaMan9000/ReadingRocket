import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Linking, TouchableOpacity } from 'react-native';
import { View, Text, Image, useTheme, Spinner, ScrollView } from 'tamagui';

import NotificationButton from '@/components/notificationButton';
import PageDisplay from '@/components/pageDisplay';
import { IDBook } from '@/interfaces/api/bookidApiResult';
import { SearchedImage } from '@/interfaces/api/imageApiResults';
import { UserForum } from '@/interfaces/app/homeInterface';
import { getIDSearchResults } from '@/services/bookApi';
import { getImageSearchResults } from '@/services/imageApi';
import { supabase } from '@/services/supabase';

const Page = () => {
  // Set zustand states
  const [userForumData, setUserForumData] = useState<UserForum[]>();
  const [imageLink, setImageLink] = useState('');
  const [enableImageQuery, setEnableImageQuery] = useState(false);
  const [books, setBooks] = useState<IDBook[]>([]);
  const [idSearchValue, setIdSearchValue] = useState('');
  const [enableBooksQuery, setEnableBooksQuery] = useState(false);
  const [bookLoopTrigger, setBookLoopTrigger] = useState(false);
  const [sliceTrigger, setSliceTrigger] = useState(false);
  const [photographerName, setPhotographerName] = useState('');

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  const imageQuery = useQuery({
    queryKey: ['image', 'calming'],
    queryFn: () => getImageSearchResults('calming'),
    enabled: enableImageQuery,
  });

  const getBooksQuery = useQuery({
    queryKey: ['getBooks'],
    queryFn: () => getIDSearchResults(idSearchValue),
    enabled: enableBooksQuery,
  });

  const getImageLink = async () => {
    try {
      const imageLinkRaw = await AsyncStorage.getItem('@ImageQueryData');
      const imageRefreshCounter = await AsyncStorage.getItem('@ImageRefreshCounter');
      console.log('🚀 ~ getImageLink ~ imageRefreshCounter:', imageRefreshCounter);
      if (imageLinkRaw) {
        if (imageRefreshCounter) {
          if (parseInt(imageRefreshCounter, 10) <= 5) {
            console.log('uhdodijjj');
            const imageLinkJSON: SearchedImage = JSON.parse(imageLinkRaw);
            console.log('🚀 ~ getImageLink ~ imageLinkJSON:', imageLinkJSON);
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            setImageLink(imageLinkJSON.results[randomNumber].urls.regular);
            setPhotographerName(imageLinkJSON.results[randomNumber].user.name);
            console.log('Got image link from AsyncStorage');
            const parsedValue = parseInt(imageRefreshCounter, 10) + 1;
            await AsyncStorage.setItem('@ImageRefreshCounter', parsedValue.toString());
            console.log('🚀 ~ getImageLink ~ imageRefreshCounter:', imageRefreshCounter);
          } else {
            console.log('🚀 ~ getImageLink ~ imageRefreshCounter ggggggg:', imageRefreshCounter);
            await imageQuery.refetch();
            await AsyncStorage.setItem('@ImageRefreshCounter', '0');
          }
        } else {
          console.log('ihpouikk');
          await AsyncStorage.setItem('@ImageRefreshCounter', '0');
          const imageLinkJSON: SearchedImage = JSON.parse(imageLinkRaw);
          const randomNumber = Math.floor(Math.random() * 10) + 1;
          setImageLink(imageLinkJSON.results[randomNumber].urls.regular);
          setPhotographerName(imageLinkJSON.results[randomNumber].user.name);
          console.log('Got image link from AsyncStorage');
          console.log('🚀 ~ getImageLink ~ imageRefreshCounter:', imageRefreshCounter);
        }
      } else {
        setEnableImageQuery(true);
        console.log('🚀 ~ getImageLink ~ imageRefreshCounter:', imageRefreshCounter);
      }
    } catch (e) {
      throw new Error(`🚀 ~ getImageLink ~ error: ${e}`);
    }
  };

  const getUserForumData = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    if (User) {
      const { data, error } = await supabase.from('user_forums').select().eq('user_id', User.id);

      if (data) {
        const userForums: UserForum[] = data;
        setUserForumData(userForums);
      }

      if (error) {
        throw new Error(`🚀 ~ getUserForumData ~ error: ${error}`);
      }
    }
  };

  const getBooksData = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    if (User) {
      const { data, error } = await supabase.from('user_books').select().eq('user_id', User.id);

      if (data) {
        try {
          const globalBookData = await AsyncStorage.getItem('@userBooks');

          if (globalBookData) {
            const parsedGlobalBookData = JSON.parse(globalBookData);
            setBooks(parsedGlobalBookData);
            setBookLoopTrigger(true);
            setSliceTrigger(true);
            console.log('Got books from asyncstorage');
          } else {
            const bookIds: { id: number; uuid: string; bookid: string; amount_of_pages: string }[] =
              data;

            bookIds.push({ id: 1, uuid: 'bogus', bookid: 'bogus', amount_of_pages: '1' });
            bookIds.push({ id: 12, uuid: 'bogus2', bookid: 'bogus2', amount_of_pages: '1' });

            console.log('🚀 ~ getBooksData ~ data:', bookIds);
            for await (const idCollection of bookIds) {
              setEnableBooksQuery(true);
              setIdSearchValue(idCollection.bookid);
              await getBooksQuery.refetch();
            }
            setBookLoopTrigger(true);
          }
          setBookLoopTrigger(true);

          await AsyncStorage.setItem('@pageInfo', JSON.stringify(data));
        } catch (e) {
          throw new Error(`🚀 ~ getBooksData ~ error: ${e}`);
        }
      }

      if (error) {
        throw new Error(`🚀 ~ getBooksData ~ error: ${error}`);
      }
    }
  };

  const saveGlobalBooks = async (value: IDBook[]) => {
    try {
      await AsyncStorage.setItem('@userBooks', JSON.stringify(value));
      setBookLoopTrigger(true);
    } catch (e) {
      throw new Error(`saveGlobalBooks, ${e}`);
    }
  };

  useEffect(() => {
    if (!imageQuery.isLoading || !imageQuery.isError) {
      console.log('IMAGE QUERY DATA', imageQuery.data);
      if (imageQuery.data) {
        setImageLink(imageQuery.data.results[0].urls.regular);
        setPhotographerName(imageQuery.data.results[0].user.name);
        console.log('gggggggg', imageQuery.data.results[0].urls.regular);
        console.log('Got image link from query');
      }
    }
  }, [imageQuery.data]);

  useEffect(() => {
    getBooksData();
    getImageLink();
    getUserForumData();
  }, []);

  useEffect(() => {
    if (getBooksQuery.data) {
      setBooks(books.concat(getBooksQuery.data));
      console.log('BOOK! 😡', books);
      if (bookLoopTrigger) {
        const newBooks = books.filter((_, index) => index !== 0);
        // @ts-ignore
        setBooks(newBooks);
        console.log('BOOK! 😡', books);
        setSliceTrigger(true);
        saveGlobalBooks(newBooks);
      }
    }
  }, [getBooksQuery.data]);

  return (
    <View flex={1} paddingHorizontal={20} paddingTop={72}>
      <View flexDirection="row">
        <View flex={1} flexDirection="row">
          <View
            bc={theme.primaryColor}
            w={40}
            alignItems="center"
            justifyContent="center"
            borderRadius={100}
            h={40}>
            <Image
              source={{
                uri: 'https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg',
                width: 36,
                height: 36,
              }}
              borderRadius={100}
              borderWidth={2}
              borderColor="#FFFFFF"
            />
          </View>
          <View flexDirection="column" ml={12}>
            {userForumData && (
              <Text color="#000" fontSize={14} fontWeight={600} lineHeight={24}>
                Hi {userForumData[0].name}
              </Text>
            )}
            <Text color="#6C6C6C" fontSize={12} fontWeight={400}>
              Welcome back!
            </Text>
          </View>
        </View>
        <NotificationButton />
      </View>
      <ScrollView>
        <TouchableOpacity onPress={() => router.push('/progress/')}>
          {imageQuery.isLoading ? (
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
          ) : (
            imageLink && (
              <ImageBackground
                source={{ uri: imageLink }}
                style={{
                  width: 380,
                  height: 148,
                  alignSelf: 'center',
                  marginTop: 30,
                  borderRadius: 5,
                  justifyContent: 'flex-end',
                  padding: 15,
                }}
                imageStyle={{ borderRadius: 5 }}>
                <View flexDirection="row" mb={5}>
                  {sliceTrigger ? (
                    <View flex={1}>
                      <Text
                        color="#FFFFFF"
                        fontSize={16}
                        fontWeight={700}
                        lineHeight={16}
                        numberOfLines={2}>
                        {books[0].volumeInfo.title}
                      </Text>
                      {books[0].volumeInfo.hasOwnProperty('authors') && (
                        <Text fontSize={10} fontWeight={500} color="#FFFFFF" numberOfLines={1}>
                          by {books[0].volumeInfo.authors}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>
                <View
                  position="absolute"
                  bc="rgba(0,0,0,0.7)"
                  w={380}
                  borderBottomLeftRadius={5}
                  borderBottomRightRadius={5}
                  h={15}
                  justifyContent="center">
                  <Text color="#FFFFFF" position="absolute" fontSize={9} ml={5}>
                    Images found on stock images and was found by{' '}
                    <Text onPress={() => Linking.openURL('google.com')} color="#ff0099">
                      {photographerName}
                    </Text>
                  </Text>
                </View>
              </ImageBackground>
            )
          )}
          <PageDisplay />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Page;
