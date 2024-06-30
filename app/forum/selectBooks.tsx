import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Input, Spinner, ScrollView } from 'tamagui';

import BookCard from '@/components/forum/BookCard';
import { getSearchResults } from '@/services/bookApi';
import useSelectBooksState from '@/store/selectBooks';
import useDebounce from '@/utils/useDebounce';

const SelectBooks = () => {
  const { searchValue, setSearchValue } = useSelectBooksState();
  const plusedSearchValue = searchValue.replace(' ', '+');
  const debouncedSearchValue = useDebounce(plusedSearchValue, 300);

  const searchQuery = useQuery({
    queryKey: ['search', debouncedSearchValue],
    queryFn: () => getSearchResults(debouncedSearchValue),
    enabled: debouncedSearchValue.length > 0,
  });

  return (
    <LinearGradient
      colors={['#6247AA', '#A06CD5']}
      end={{ x: 0.9, y: 0.7 }}
      style={{ paddingHorizontal: 20, flex: 1 }}>
      <View
        flexDirection="row"
        width="90%"
        height={40}
        borderWidth={0.5}
        borderColor="#E0E0E0"
        mt={120}
        alignSelf="center"
        borderRadius={5}
        alignItems="center"
        backgroundColor={"#FFFFFF"}>
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
      <ScrollView mt={50}>
        {searchQuery.isLoading && <Spinner size="large" color="#ffffff" />}
        {searchQuery.data?.items && (
          <View flexDirection="row" flexWrap="wrap" justifyContent="center">
            {searchQuery.data?.items.map((item) => (
              <BookCard book={item} key={item.volumeInfo.title} />
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default SelectBooks;
