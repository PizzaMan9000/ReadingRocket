import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, useTheme, Progress, Button, Input } from 'tamagui';

import { IDBook } from '@/interfaces/api/bookidApiResult';
import { supabase } from '@/services/supabase';

interface BookProgressProps {
  book: IDBook;
  setBooks: (books: IDBook[]) => void;
  dailyPages: number;
  setDailyPages: (dailyPages: number) => void;
}

interface PageInfoType {
  id: number;
  user_id: string;
  bookid: string;
  amount_of_pages: string;
  pages_read: string;
}

const BookProgress = ({ book, setBooks, dailyPages, setDailyPages }: BookProgressProps) => {
  const [pages, setPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [defaultColor, setDefaultColor] = useState<boolean>();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const getPageInfo = async () => {
    try {
      const rawPageInfo = await AsyncStorage.getItem('@pageInfo');
      if (rawPageInfo) {
        const parsedPageInfo: PageInfoType[] = JSON.parse(rawPageInfo);
        for (let i = 0; i < parsedPageInfo.length; i++) {
          if (parsedPageInfo[i].bookid === book.id) {
            setPages(parsedPageInfo[i].amount_of_pages);
            setPagesRead(parsedPageInfo[i].pages_read);
            if (i % 2 === 0) {
              setDefaultColor(true);
            } else {
              setDefaultColor(false);
            }
          }
        }
      } else {
        // Error handling later
        console.log('error detected');
      }
    } catch (e) {
      console.log('🚀 ~ getPageInfo ~ error:', e);
    }
  };

  const deleteBook = async () => {
    try {
      const rawBookInfo = await AsyncStorage.getItem('@userBooks');
      if (rawBookInfo) {
        let parsedBookInfo: IDBook[] = JSON.parse(rawBookInfo);
        parsedBookInfo = parsedBookInfo.filter((idBook) => idBook.id !== book.id);
        setBooks(parsedBookInfo);

        await AsyncStorage.setItem('@userBooks', JSON.stringify(parsedBookInfo));
      } else {
        console.log('Error spotted!');
        // Error handling
      }

      const response = await supabase.from('user_books').delete().eq('bookid', book.id);
      console.log('🚀 ~ deleteBook ~ supabase response:', response);
    } catch (e) {
      console.log('🚀 ~ deleteBook ~ e:', e);
    }
  };

  const updatePagesRead = async () => {
    if (pagesRead === null) {
      setPagesRead('0');
    }
    if (parseInt(pagesRead, 10) > parseInt(pages, 10)) {
      setPagesRead(pages);
    }
    if (parseInt(pagesRead, 10) < 0) {
      setPagesRead('0');
    }
    try {
      const rawPageInfo = await AsyncStorage.getItem('@pageInfo');
      if (rawPageInfo) {
        const parsedPageInfo: PageInfoType[] = JSON.parse(rawPageInfo);
        for (let i = 0; i < parsedPageInfo.length; i++) {
          if (parsedPageInfo[i].bookid === book.id) {
            parsedPageInfo[i].pages_read = pagesRead;
            await AsyncStorage.setItem('@pageInfo', JSON.stringify(parsedPageInfo));
          }
        }
      } else {
        // Error handling later
        console.log('error detected');
      }
    } catch (e) {
      throw new Error(`update Pages Read ${e}`);
    }
  };

  useEffect(() => {
    updatePagesRead();
  }, [pagesRead]);

  useEffect(() => {
    getPageInfo();
  }, []);

  useEffect(() => {
    console.log(book.volumeInfo.imageLinks);
  }, [book.volumeInfo.imageLinks]);

  return (
    <View flexDirection="row" marginVertical={20}>
      {book.volumeInfo.imageLinks ? (
        <Image
          source={{
            uri: book.volumeInfo.imageLinks.smallThumbnail,
            width: 65,
            height: 90,
          }}
          style={{ borderRadius: 5, width: 65, height: 90 }}
        />
      ) : (
        <View
          w={65}
          height={65}
          backgroundColor={theme.complementaryColor}
          alignItems="center"
          justifyContent="center"
          mb={10}
          borderRadius={5}>
          <Ionicons name="warning-outline" size={16} color={theme.primaryColor} />
          <Text fontSize={10} color={theme.primaryColor} fontWeight={500} textAlign="center">
            There isn't any cover found for this book
          </Text>
        </View>
      )}
      <View flex={1} ml={7} flexDirection="column">
        <View flexDirection="row" alignItems="center">
          <Text numberOfLines={1} fontWeight={500} flex={1} color="#1F0318" fontSize={11}>
            {book.volumeInfo.title}
          </Text>
          <Button p={0} onPress={() => deleteBook()} position="absolute" ml={280}>
            <FontAwesome name="trash-o" size={24} color="#FF0000" />
          </Button>
        </View>
        {book.volumeInfo.authors ? (
          <Text numberOfLines={1} color={theme.primaryColor} fontSize={10} fontWeight={500}>
            By {book.volumeInfo.authors}
          </Text>
        ) : (
          <View h={16} w="100%" />
        )}
        {pages && pagesRead ? (
          <View flexDirection="column">
            <View flexDirection="row">
              <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
                {pagesRead}/{pages} pages
              </Text>
              {defaultColor ? (
                <Text color={theme.primaryColor} fontSize={14} fontWeight={500}>
                  {Math.floor((parseFloat(pagesRead) / parseFloat(pages)) * 100)}%
                </Text>
              ) : (
                <Text color={theme.secondaryColorOne} fontSize={14} fontWeight={500}>
                  {Math.floor((parseFloat(pagesRead) / parseFloat(pages)) * 100)}%
                </Text>
              )}
            </View>
            {defaultColor ? (
              <Progress
                size="$3"
                backgroundColor={theme.complementaryColorTwo}
                value={Math.floor((parseFloat(pagesRead) / parseFloat(pages)) * 100)}
                mt={2}>
                <Progress.Indicator
                  backgroundColor={theme.primaryColor}
                  animation="bouncy"
                  borderTopRightRadius={100}
                  borderBottomRightRadius={100}
                />
              </Progress>
            ) : (
              <Progress
                size="$3"
                backgroundColor={theme.complementaryColorTwo}
                value={Math.floor((parseFloat(pagesRead) / parseFloat(pages)) * 100)}
                mt={2}>
                <Progress.Indicator
                  backgroundColor={theme.secondaryColorOne}
                  animation="bouncy"
                  borderTopRightRadius={100}
                  borderBottomRightRadius={100}
                />
              </Progress>
            )}
            <View flexDirection="row" mt={5} justifyContent="center" alignItems="center">
              <Button onPress={() => setPagesRead((parseInt(pagesRead, 10) + 1).toString())}>
                <Feather name="plus" size={23} color="#ABABAB" />
              </Button>
              <Input
                textAlign="center"
                h={30}
                borderColor="#ABABAB"
                value={pagesRead}
                onChangeText={(text) => setPagesRead(text)}
              />
              <Button onPress={() => setPagesRead((parseInt(pagesRead, 10) - 1).toString())}>
                <Feather name="minus" size={23} color="#ABABAB" />
              </Button>
            </View>
          </View>
        ) : (
          <View h={25} w="100%" />
        )}
      </View>
    </View>
  );
};

export default BookProgress;
