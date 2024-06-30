import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image } from 'react-native';
import { View, Text } from 'tamagui';

import { Item } from '@/interfaces/bookApiResults';
import useBookCardStore from '@/store/bookCard';

type BookCardProps = {
  book: Item;
};

export default function BookCard({ book }: BookCardProps) {
  const { checked, setChecked } = useBookCardStore();

  const interactBook = () => {
    setChecked(!checked);
  };

  return (
    <View>
      {checked && (
        <View
          backgroundColor="#02CCFE"
          padding={2}
          borderRadius={100}
          position="absolute"
          zIndex={1}>
          <Ionicons name="checkmark" color="#FFFFFF" size={15} />
        </View>
      )}
      <View
        w={120}
        h={185}
        alignItems="center"
        backgroundColor="#FFFFFF"
        margin={4}
        paddingVertical={10}
        paddingHorizontal={5}
        borderRadius={10}
        onPress={interactBook}>
        {book.volumeInfo.imageLinks ? (
          <Image
            source={{ uri: book.volumeInfo.imageLinks?.smallThumbnail, width: 74, height: 114 }}
          />
        ) : (
          <View
            w={74}
            height={114}
            backgroundColor="#E2CFEA"
            alignItems="center"
            justifyContent="center">
            <Ionicons name="warning-outline" size={30} color="#6247AA" />
            <Text fontSize={11} color="#6247AA" fontWeight={500} textAlign="center">
              There isn't any cover found for this book
            </Text>
          </View>
        )}
        <Text numberOfLines={1} mt={5} fontSize={11} fontWeight={500} lineHeight={16}>
          {book.volumeInfo.title}
        </Text>
        <Text numberOfLines={2} color="#6247AA" fontSize={10} fontWeight={500} lineHeight={16}>
          {book.volumeInfo.authors}
        </Text>
      </View>
    </View>
  );
}
