import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Input, Spinner, ScrollView, Button, Text, useTheme } from 'tamagui';

import BackButton from '@/components/backButton';
import BookCard from '@/components/forum/BookCard';
import SelectedCard from '@/components/forum/SelectedCard';
import { Item } from '@/interfaces/api/bookApiResults';
import { dataSaved } from '@/interfaces/app/forumInterface';
import { getSearchResults } from '@/services/api/bookApi';
import useSelectBooksState from '@/store/selectBooksStore';
import { ForumHeaders } from '@/tamagui.config';
import useDebounce from '@/utils/useDebounce';

const SelectBooks = () => {
  // Set zustand states
  const { searchValue, setSearchValue } = useSelectBooksState();
  const { startIndex, setStartIndex } = useSelectBooksState();
  const plusedSearchValue = searchValue.replace(' ', '+');
  const debouncedSearchValue = useDebounce(plusedSearchValue, 300);
  const [allBooks, setAllBooks] = useState<Item[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<dataSaved[]>([]);

  const navigation = useNavigation();

  const searchQuery = useQuery({
    queryKey: ['search', debouncedSearchValue, startIndex],
    queryFn: () => getSearchResults(debouncedSearchValue, startIndex),
    enabled: debouncedSearchValue.length > 0,
  });

  useEffect(() => {
    if (!searchQuery.isLoading && searchQuery.data?.items) {
      setAllBooks([...allBooks, ...searchQuery.data.items]);
    }
  }, [searchQuery.data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setSearchValue('');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('selected book - ', selectedBooks);
  }, [selectedBooks]);

  useEffect(() => {
    setAllBooks([]);
    setStartIndex(0);
    if (!searchQuery.isLoading && searchQuery.data?.items) {
      setAllBooks([...allBooks, ...searchQuery.data.items]);
    }
  }, [debouncedSearchValue]);

  const increaseStartIndex = () => {
    console.log('working');
    if (searchQuery.data != null) {
      if (startIndex <= searchQuery.data.totalItems) {
        const newStartIndex = Math.min(startIndex + 41, searchQuery.data.totalItems);
        console.log(' ~ increaseMaxResults ~ newStartIndex:', newStartIndex);
        setStartIndex(newStartIndex);
        searchQuery.refetch();
      }
    }
  };

  const handleLoadMore = () => {
    increaseStartIndex();
  };

  const handleBookSelection = (
    bookId: string,
    title: string,
    pageCount: number | undefined,
    cover?: string,
    authors?: string[]
  ) => {
    setSelectedBooks((prevSelectedBooks) => {
      const isSelected = prevSelectedBooks.some((book) => book.id === bookId);
      const updatedBooks = isSelected
        ? prevSelectedBooks.filter((book) => book.id !== bookId)
        : [...prevSelectedBooks, { id: bookId, title, cover, authors, pageCount }];
      return updatedBooks;
    });
  };

  const removeBookFromSelection = (bookId: any) => {
    setSelectedBooks((prevSelectedBooks) => prevSelectedBooks.filter((book) => book.id !== bookId));
  };

  const screenTransfer = async () => {
    // eslint-disable-next-line prettier/prettier, no-sequences, no-unused-expressions
    const bookIdsPage = selectedBooks.map(item => ({id: item.id, pageCount: item.pageCount, pagesRead: 0 }))

    try {
      await AsyncStorage.setItem('@currentPagesBookIds', JSON.stringify(bookIdsPage));
    } catch (e) {
      console.log(e);
      // set up error handling
      return;
    }

    if (selectedBooks.length === 0) {
      router.replace('/forum/loading');
    } else {
      router.push('/forum/bookInfo');
    }
  };

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  return (
    <LinearGradient colors={['#6247AA', '#A06CD5']} end={{ x: 0.9, y: 0.7 }} style={{ flex: 1 }}>
      <BackButton absolute marginLeft={20} marginTop={60} />
      <ForumHeaders mt={105} paddingTop={20}>
        Search for your books
      </ForumHeaders>
      <View padding={15}>
        <ScrollView horizontal>
          {selectedBooks.map((item) => (
            <SelectedCard onRemove={removeBookFromSelection} book={item} key={item.id} />
          ))}
        </ScrollView>
      </View>
      <View
        flexDirection="row"
        width="90%"
        height={40}
        borderWidth={0.5}
        borderColor="#E0E0E0"
        alignSelf="center"
        borderRadius={5}
        alignItems="center"
        backgroundColor="#FFFFFF">
        <Input
          value={searchValue}
          onChangeText={setSearchValue}
          borderWidth={0}
          placeholder="Lord of the rings"
          placeholderTextColor="#C4C4C4"
          fontSize={10}
          fontWeight={400}
          lineHeight={16}
          width="90%"
        />
        <Ionicons name="search" size={24} color="#6247AA" />
      </View>
      <ScrollView scrollEnabled={!searchQuery.isLoading} overflow="hidden">
        {searchQuery.isLoading && <Spinner size="large" color="#ffffff" />}
        {allBooks.length > 0 && (
          <View flexDirection="row" flexWrap="wrap" justifyContent="center">
            {allBooks.map((item) => (
              <BookCard
                book={item}
                key={item.id}
                onSelect={handleBookSelection}
                selected={selectedBooks.some((book) => book.id === item.id)}
              />
            ))}
          </View>
        )}
        {searchQuery.data && searchQuery.data?.totalItems > allBooks.length && (
          <LinearGradient
            colors={[
              'rgba(160, 108, 213,0.5)',
              'rgba(255, 255, 255, 0.7)',
              'rgba(160, 108, 213,0.9)',
            ]}
            style={{
              bottom: 0,
              width: '100%',
              height: 80,
              zIndex: 1,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button onPress={handleLoadMore}>
              <Text fontWeight={700} color={theme.primaryColor} fontSize={15}>
                See more
              </Text>
            </Button>
          </LinearGradient>
        )}
      </ScrollView>
      <View
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        bc={theme.primaryColor}
        paddingVertical={15}
        paddingHorizontal={50}
        borderRadius={10}
        mb={50}
        w="60%"
        alignSelf="center"
        onPress={screenTransfer}>
        <Text color="#FFFFFF" mr={8} fontSize={20} fontWeight={800} letterSpacing={2}>
          NEXT
        </Text>
        <FontAwesome name="arrow-right" size={24} color="#FFFFFF" />
      </View>
    </LinearGradient>
  );
};

export default SelectBooks;
