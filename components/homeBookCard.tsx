import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, Text, useTheme } from 'tamagui';

import { IDBook } from '@/interfaces/api/bookidApiResult';

type HomeBookCardProps = {
  book: IDBook;
};

const HomeBookCard = ({ book }: HomeBookCardProps) => {
  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  return (
    <TouchableOpacity
      style={{
        width: 120,
        height: 185,
        alignItems: 'center',
        margin: 4,
        paddingVertical: 10,
        paddingHorizontal: 5,
      }}>
      {book.volumeInfo.imageLinks ? (
        <Image
          source={{
            uri: 'https' + book.volumeInfo.imageLinks.smallThumbnail.substr(4),
            width: 104,
            height: 104,
          }}
          style={{ borderRadius: 5 }}
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
        lineHeight={16}
        margin={0}>
        {book.volumeInfo.authors}
      </Text>
    </TouchableOpacity>
  );
};

export default HomeBookCard;
