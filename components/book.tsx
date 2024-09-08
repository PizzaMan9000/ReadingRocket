import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text, Image, useTheme } from 'tamagui';

import { IDBook } from '@/interfaces/api/bookidApiResult';
import useGlobalStore from '@/store/globalStore';

interface BookProps {
  book: IDBook;
}

const Book = ({ book }: BookProps) => {
  const { setSelectedBook } = useGlobalStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const windowWidth = Dimensions.get('window').width / 2 - 40;

  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ width: windowWidth, height: 168, margin: 12 }}
      onPress={() => {
        setSelectedBook(book);
        router.push(`/viewBook`);
      }}>
      {book.volumeInfo.imageLinks ? (
        <Image
          source={{
            uri: 'https' + book.volumeInfo.imageLinks.thumbnail.substr(4),
            width: 168,
            height: 168,
          }}
          style={{ width: '100%', height: 168, borderRadius: 5 }}
        />
      ) : (
        <View
          w="100%"
          h={168}
          alignItems="center"
          justifyContent="center"
          br={5}
          backgroundColor={theme.primaryColor}>
          <Text>Image not found</Text>
        </View>
      )}
      <View mt={6}>
        <Text fontSize={11} fontWeight={500} color="1F0318" lineHeight={16}>
          {book.volumeInfo.title}
        </Text>
        {book.volumeInfo.authors ? (
          <Text color={theme.primaryColor} fontSize={10} fontWeight={500} lineHeight={16}>
            {book.volumeInfo.authors}
          </Text>
        ) : (
          <View w="100%" h={16} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Book;
