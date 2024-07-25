import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, useTheme } from 'tamagui';

import { Item } from '@/interfaces/api/bookApiResults';

type BookCardProps = {
  book: Item;
  onSelect: (
    bookId: string,
    title: string,
    pageCount: number | undefined,
    cover?: string,
    authors?: string[]
  ) => void;
  selected: boolean; // Pass the selection state prop
};

export default function BookCard({ book, onSelect, selected }: BookCardProps) {
  const [checked, setChecked] = useState(selected);

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const handleBookInteraction = () => {
    setChecked(!checked);
    onSelect(
      book.id,
      book.volumeInfo.title,
      book.volumeInfo.pageCount,
      book.volumeInfo.imageLinks?.smallThumbnail,
      book.volumeInfo.authors
    );
  };

  useEffect(() => {
    setChecked(selected);
  }, [selected]);

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
      <TouchableOpacity
        style={{
          width: 120,
          height: 185,
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          margin: 4,
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderRadius: 10,
        }}
        onPress={handleBookInteraction}>
        {checked && (
          <LinearGradient
            colors={['rgba(255,255,255, 0.2)', '#FFFFFF']}
            style={{
              width: 120,
              height: 185,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              borderRadius: 10,
              zIndex: 4,
            }}>
            {book.volumeInfo.pageCount === null || 0 ? (
              <Text fontSize={11} fontWeight={500} textAlign="center">
                Unknown amount of Pages
              </Text>
            ) : (
              <Text fontSize={11} fontWeight={500} textAlign="center">
                {book.volumeInfo.pageCount} Pages
              </Text>
            )}
          </LinearGradient>
        )}
        {book.volumeInfo.imageLinks ? (
          <Image
            source={{ uri: book.volumeInfo.imageLinks?.smallThumbnail, width: 74, height: 114 }}
          />
        ) : (
          <View
            w={74}
            height={114}
            backgroundColor={theme.complementaryColor}
            alignItems="center"
            justifyContent="center">
            <Ionicons name="warning-outline" size={30} color={theme.primaryColor} />
            <Text fontSize={11} color={theme.primaryColor} fontWeight={500} textAlign="center">
              There isn't any cover found for this book
            </Text>
          </View>
        )}
        <Text numberOfLines={2} mt={5} fontSize={11} fontWeight={500} lineHeight={16}>
          {book.volumeInfo.title}
        </Text>
        <Text
          numberOfLines={1}
          color={theme.primaryColor}
          fontSize={10}
          fontWeight={500}
          lineHeight={16}>
          {book.volumeInfo.authors}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
