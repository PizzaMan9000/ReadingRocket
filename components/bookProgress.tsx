import { AntDesign, Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, Modal } from 'react-native';
import { View, Text, useTheme, Progress, Button, Input, Popover, Separator } from 'tamagui';

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
  const [newPages, setNewPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [changePagesToggle, setChangePagesToggle] = useState(false);
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

  const updatePages = async () => {
    const { error } = await supabase
      .from('user_books')
      .update({ amount_of_pages: pages })
      .eq('bookid', book.id);

    if (error) {
      console.log('🚀 ~ updatePages ~ error:', error);
    }
  };

  const handlePagesSetSubmit = () => {
    setChangePagesToggle(false);
    Keyboard.dismiss();
  };

  // useEffect(() => {
  //   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
  //     if (changePagesToggle === true) {
  //       setChangePagesToggle(false);
  //       setLoadingToggle(true);
  //       updatePages();
  //     }
  //     console.log("HELLOOOAOAOAO");
  //   });

  //   return () => {
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  useEffect(() => {
    // Listener for keyboard dismiss event
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setChangePagesToggle(false);
    });

    return () => {
      // Clean up the listener when the component unmounts
      keyboardDidHideListener.remove();
    };
  }, []);

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
    if (newPages == null || newPages === '') {
      return;
    }
    let parsedPages = parseInt(newPages, 10);
    if (parsedPages < parseInt(pagesRead, 10)) {
      parsedPages = parseInt(pages, 10) + 1;
    }

    const newBookIdsPages = bookIdsPage;
    for (let i = 0; i < newBookIdsPages.length; i++) {
      if (newBookIdsPages[i].id === book.id) {
        newBookIdsPages[i].pageCount = parsedPages;
        setBookIdsPage(newBookIdsPages);

        setPages((bookIdsPage[i].pageCount ?? 0).toString());
        setPagesRead(bookIdsPage[i].pagesRead.toString());
        updatePages();
      }
    }
  }, [newPages]);

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
          <Popover
            size="$5"
            allowFlip
            open={isPopoverVisible}
            onOpenChange={setIsPopoverVisible}
            placement="left"
            strategy="fixed">
            <Popover.Trigger asChild>
              <Button p={0} position="absolute" ml={280} onPress={() => setIsPopoverVisible(true)}>
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
              <Button
                p={0}
                flexDirection="row"
                onPress={() => {
                  setChangePagesToggle(!changePagesToggle);
                  setIsPopoverVisible(false);
                }}>
                <Text fontSize={13} color="#ABABAB" mr={10}>
                  Change amount of pages
                </Text>
                <AntDesign name="book" size={24} color="#ABABAB" />
              </Button>
              <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="rgba(0,0,0, 0.4)">
                  <View
                    backgroundColor="#ffffff"
                    width={350}
                    h={200}
                    alignItems="center"
                    borderRadius={5}>
                    <View mt={50}>
                      <Text
                        fontSize={14}
                        color={theme.primaryColor}
                        fontWeight={500}
                        textAlign="center">
                        Are you sure you want to delete this book?
                      </Text>
                      <Text alignSelf="center" fontSize={11} color="#ABABAB">
                        Deleting this book will be permenant
                      </Text>
                    </View>
                    <View flexDirection="row" justifyContent="center" mt={35} gap={10}>
                      <Button
                        onPress={() => setModalVisible(false)}
                        backgroundColor={theme.primaryColor}
                        color="#ffffff">
                        Cancel
                      </Button>
                      <Button
                        onPress={() => {
                          setModalVisible(false);
                          setIsPopoverVisible(false);
                          deleteBook();
                        }}
                        backgroundColor={theme.complementaryColor}
                        borderWidth={2}
                        borderColor={theme.primaryColor}
                        color={theme.primaryColor}>
                        Delete
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
              <Separator borderColor="#ABABAB" h={2} w="100%" />
              <Button p={0} flexDirection="row" onPress={() => setModalVisible(true)}>
                <Text fontSize={13} color="#FF0000" mr={10}>
                  Delete
                </Text>
                <FontAwesome name="trash-o" size={24} color="#FF0000" />
              </Button>
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
              {changePagesToggle ? (
                <View flexDirection="row" flex={1} alignItems="center">
                  <Text color="#ABABAB" fontSize={10} fontWeight={400}>
                    {pagesRead}/
                  </Text>
                  <Input
                    height={20}
                    borderColor="#ABABAB"
                    color="#ABABAB"
                    value={newPages}
                    onSubmitEditing={handlePagesSetSubmit}
                    blurOnSubmit={false}
                    autoFocus
                    onChangeText={(text) => setNewPages(text)}
                  />
                </View>
              ) : (
                <Text color="#ABABAB" fontSize={10} fontWeight={400} flex={1}>
                  {pagesRead}/{pages} pages
                </Text>
              )}
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
