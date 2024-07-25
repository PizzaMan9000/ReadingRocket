import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, Text } from 'tamagui';

import { dataSaved } from '@/interfaces/app/forumInterface';

interface SelectedCardProps {
  book: dataSaved;
  onRemove: (bookId: string) => void; // Updated function name and parameter
}

const SelectedCard = ({ book, onRemove }: SelectedCardProps) => {
  const [checked, setChecked] = useState(true);

  const handleRemoveBook = () => {
    setChecked(false);
    onRemove(book.id); // Pass the book ID for removal
  };

  return (
    <View>
      {checked && (
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6961',
            padding: 2,
            borderRadius: 100,
            marginTop: 9,
            position: 'absolute',
            zIndex: 1,
          }}
          onPress={handleRemoveBook}>
          <Ionicons name="close" color="#FFFFFF" size={15} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{
          width: 120,
          height: 185,
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          marginVertical: 15,
          marginHorizontal: 4,
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderRadius: 10,
        }}
        onPress={handleRemoveBook}>
        {book.cover ? (
          <Image source={{ uri: book.cover, width: 74, height: 114 }} />
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
        <Text numberOfLines={2} mt={5} fontSize={11} fontWeight={500} lineHeight={16}>
          {book.title}
        </Text>
        <Text numberOfLines={1} color="#6247AA" fontSize={10} fontWeight={500} lineHeight={16}>
          {book.authors}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectedCard;
