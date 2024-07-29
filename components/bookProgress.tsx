import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { View, Text, useTheme, Progress, Button, Input } from 'tamagui';

import { IDBook } from '@/interfaces/api/bookidApiResult';
import { supabase } from '@/services/clients/supabase';
import useBooksStore from '@/store/booksStore';

interface BookProgressProps {
  book: IDBook;
  setBooks: (books: IDBook[]) => void;
}

// interface PageInfoType {
//   id: number;
//   user_id: string;
//   bookid: string;
//   amount_of_pages: string;
//   pages_read: string;
// }

const BookProgress = ({ book, setBooks }: BookProgressProps) => {
  const [pages, setPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [defaultColor, setDefaultColor] = useState<boolean>();
  const { bookIdsPage, setBookIdsPage, books } = useBooksStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const getPageInfo = () => {
    for (let i = 0; i < bookIdsPage.length; i++) {
      if (bookIdsPage[i].id === book.id) {
        setPages((bookIdsPage[i].pageCount ?? 0).toString());
        setPagesRead(bookIdsPage[i].pagesRead.toString());
        if (i % 2 === 0) {
          setDefaultColor(true);
        } else {
          setDefaultColor(false);
        }
      }
    }
  };

  const deleteBook = async () => {
    const changedBooks = books.filter((idBook) => idBook.id !== book.id);
    setBooks(changedBooks);

    const response = await supabase.from('user_books').delete().eq('bookid', book.id);
    console.log('🚀 ~ deleteBook ~ supabase response:', response);
  };

  const updatePagesRead = async () => {
    if (typeof pagesRead !== 'string') {
      setPagesRead('0'); // Set a default value if not a string
      return;
    }
    const parsedPagesRead = parseInt(pagesRead, 10);
    if (isNaN(parsedPagesRead)) {
      console.log('Invalid pagesRead value:', pagesRead);
      return; // Handle the error gracefully
    }
    setPagesRead(Math.max(0, Math.min(parsedPagesRead, parseInt(pages, 10))).toString());

    for (let i = 0; i < bookIdsPage.length; i++) {
      if (bookIdsPage[i].id === book.id) {
        const mutableBookIdsPage = bookIdsPage;
        mutableBookIdsPage[i].pagesRead = parseInt(pagesRead, 10);
        setBookIdsPage(mutableBookIdsPage);
        // Do the supabase code
        console.log('setting is done!');
      }
    }
  };

  useEffect(() => {
    console.log('books', bookIdsPage);
    updatePagesRead();
  }, [pagesRead]);

  useEffect(() => {
    getPageInfo();
  }, []);

  useEffect(() => {
    console.log(book.volumeInfo.imageLinks.smallThumbnail);
  }, [book.volumeInfo.imageLinks.smallThumbnail]);

  return (
    <View flexDirection="row" marginVertical={20}>
      {book.volumeInfo.imageLinks ? (
        <FastImage
          source={{
            uri: book.volumeInfo.imageLinks.smallThumbnail,
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
