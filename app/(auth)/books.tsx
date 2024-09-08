import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Input, View, Text, ScrollView } from 'tamagui';

import Book from '@/components/book';
import Header from '@/components/header';
import { IDBook } from '@/interfaces/api/bookidApiResult';
import useBooksStore from '@/store/booksStore';

const Page = () => {
  const [searchValue, setSearchValue] = useState('');
  const [displayBooks, setDisplayBooks] = useState<IDBook[]>([]);
  const { books } = useBooksStore();

  const router = useRouter();

  useEffect(() => {
    if (searchValue === '' || null) {
      setDisplayBooks(books);
    } else {
      setDisplayBooks([]);
      const preDisplayBooks: IDBook[] = [];
      for (let i = 0; i < books.length; i++) {
        if (books[i].volumeInfo.title.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
          preDisplayBooks.push(books[i]);
        }
      }
      setDisplayBooks(preDisplayBooks);
    }
  }, [searchValue]);

  return (
    <View paddingHorizontal={20} paddingTop={72} flex={1}>
      <Header
        headerValue="All of your books"
        backMarginTop={0}
        backMarginLeft={0}
        backAbsolute={false}
      />
      <View flexDirection="row" alignItems="center">
        <View
          flexDirection="row"
          width="90%"
          height={40}
          borderWidth={0.5}
          borderColor="#E0E0E0"
          alignSelf="center"
          borderRadius={5}
          alignItems="center"
          mt={37}>
          <Input
            value={searchValue}
            onChangeText={setSearchValue}
            borderWidth={0}
            placeholder="Search Book"
            placeholderTextColor="#222222"
            fontSize={10}
            fontWeight={400}
            lineHeight={16}
            width="90%"
          />
          <Ionicons name="search" size={24} color="#6247AA" />
        </View>
        <TouchableOpacity onPress={() => router.push('/addBook')}>
          <View mt={32} ml={16}>
            <AntDesign name="plus" size={24} color="#6247AA" />
          </View>
        </TouchableOpacity>
      </View>
      <Text color="#C4C4C4" fontSize={10} fontWeight={400} mt={18} lineHeight={16}>
        Showing Results
      </Text>
      <ScrollView flex={1} overflow="hidden">
        <View flexDirection="row" justifyContent="center">
          {displayBooks && displayBooks.map((item) => <Book key={item.id} book={item} />)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;
