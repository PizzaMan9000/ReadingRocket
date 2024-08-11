import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, useTheme, Progress, Button, Input, Popover, Dialog } from 'tamagui';

import { IDBook } from '@/interfaces/api/bookidApiResult';
import { supabase } from '@/services/clients/supabase';
import useBooksStore from '@/store/booksStore';
import useProgressStore from '@/store/progressStore';

interface BookProgressProps {
  book: IDBook;
}

// interface PageInfoType {
//   id: number;
//   user_id: string;
//   bookid: string;
//   amount_of_pages: string;
//   pages_read: string;
// }

const BookProgress = ({ book }: BookProgressProps) => {
  const [pages, setPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [defaultColor, setDefaultColor] = useState<boolean>();
  const { bookIdsPage, setBookIdsPage, books, setBooks } = useBooksStore();
  const { dailyPagesRead, setDailyPagesRead } = useProgressStore();

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
    getPageInfo();
  }, []);

  useEffect(() => {
    console.log('books', bookIdsPage);
    if (pagesRead !== null || '') {
      updatePagesRead();
    }
  }, [pagesRead]);

  useEffect(() => {
    console.log('🚀 ~ BookProgress ~ book:', book.volumeInfo.imageLinks);
  }, [book]);

  return (
    <View flexDirection="row" marginVertical={20}>
      {book.volumeInfo.imageLinks ? (
        <Image
          source={{
            uri: 'https' + book.volumeInfo.imageLinks.thumbnail.substr(4),
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
          <Popover size="$5" allowFlip>
            <Popover.Trigger asChild>
              <Button p={0} position="absolute" ml={280}>
                <Entypo name="dots-three-horizontal" size={24} color="#838383" />
              </Button>
            </Popover.Trigger>
            <Popover.Content
              borderWidth={0}
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              paddingVertical={4}
              paddingHorizontal={12}
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              backgroundColor="#FFFFFF">
              <Popover.Arrow borderWidth={0} backgroundColor="#ffffff" />
              <Dialog modal>
                <Dialog.Trigger asChild>
                  <Button p={0} flexDirection="row" alignItems="center">
                    <Text fontSize={13} color="#FF0000" mr={10}>
                      Delete
                    </Text>
                    <FontAwesome name="trash-o" size={24} color="#FF0000" />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay
                    key="overlay"
                    animation="lazy"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                  <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={['transform', 'opacity']}
                    animation={[
                      'quick',
                      {
                        opacity: {
                          overshootClamping: true,
                        },
                      },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                    borderWidth={0}
                    backgroundColor="#FFFFFF">
                    <Text fontSize={13} color={theme.primaryColor} fontWeight={500}>
                      Are you sure you want to delete this book?
                    </Text>
                    <Text alignSelf="center" fontSize={11} color="#ABABAB">
                      Deleting this book will be permenant
                    </Text>
                    <View flexDirection="row" justifyContent="center">
                      <Dialog.Close asChild>
                        <Button>Cancel</Button>
                      </Dialog.Close>
                      <Button onPress={() => deleteBook()}>Delete</Button>
                    </View>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </Popover.Content>
          </Popover>
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
          </View>
        ) : (
          <View h={25} w="100%" />
        )}
        <View flexDirection="row" mt={5} justifyContent="center" alignItems="center">
          <Button
            onPress={() => {
              setPagesRead((parseInt(pagesRead, 10) + 1).toString());
              if (pagesRead !== pages) {
                setDailyPagesRead(Math.min(100, dailyPagesRead + 1));
              }
            }}>
            <Feather name="plus" size={23} color="#ABABAB" />
          </Button>
          <Input
            textAlign="center"
            h={30}
            borderColor="#ABABAB"
            value={pagesRead}
            onChangeText={(text) => {
              if (text === null || text === '') {
                console.log('her222222e');
                return;
              }
              console.log('🚀 ~ BookProgress ~ text:', text);

              const parsedText = parseInt(text, 10);
              const parsedPagesRead = parseInt(pagesRead, 10);
              const difference = parsedText - parsedPagesRead;
              if (pagesRead !== pages && pagesRead !== '0') {
                setDailyPagesRead(Math.max(0, Math.min(100, dailyPagesRead + difference)));
              }
              setPagesRead(text);
            }}
          />
          <Button
            onPress={() => {
              setPagesRead((parseInt(pagesRead, 10) - 1).toString());
              if (pagesRead !== '0') {
                setDailyPagesRead(Math.max(0, dailyPagesRead - 1));
              }
            }}>
            <Feather name="minus" size={23} color="#ABABAB" />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default BookProgress;
