import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, useTheme } from 'tamagui';

import Header from '@/components/header';
import useGlobalStore from '@/store/globalStore';

const Page = () => {
  const { selectedBook } = useGlobalStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  return (
    <View flex={1}>
      {selectedBook && (
        <View paddingHorizontal={20} paddingTop={72} flex={1} alignItems="center">
          <Header
            headerValue={selectedBook.volumeInfo.title}
            backMarginTop={0}
            backMarginLeft={0}
            backAbsolute={false}
          />
          {selectedBook.volumeInfo.imageLinks ? (
            <Image
              source={{
                uri: 'https' + selectedBook.volumeInfo.imageLinks.thumbnail.substr(4),
                width: 146,
                height: 220,
              }}
              style={{ width: 146, height: 220, marginTop: 30, borderRadius: 5 }}
            />
          ) : (
            // Find Default Image link
            <Image />
          )}
          <View mt={30} alignItems="center">
            <Text color="#1F0318" fontSize={14} fontWeight={600} lineHeight={16}>
              {selectedBook.volumeInfo.title}
            </Text>
            <View flexDirection="row" alignItems="center" mt={10}>
              <Text color={theme.primaryColor} fontSize={12} fontWeight={600} lineHeight={16}>
                By {selectedBook.volumeInfo.authors ?? 'Unknown Author'}
              </Text>
              <View
                paddingHorizontal={5}
                paddingVertical={3}
                backgroundColor={theme.complementaryColorTwo}
                borderRadius={5}
                ml={17}>
                <Text color={theme.primaryColor} fontWeight={400}>
                  <Text fontWeight={700}>
                    {selectedBook.volumeInfo.pageCount ?? 'Unknown amount of'}
                  </Text>{' '}
                  Pages
                </Text>
              </View>
            </View>
          </View>
          <View mt={18}>
            <Text color="#1F0418" fontSize={12} fontWeight={500} lineHeight={16}>
              Description
            </Text>
            {/* Do the see more set up for the description */}
            <Text color="#AAA" fontSize={10} lineHeight={16} fontWeight={400} numberOfLines={15}>
              {selectedBook.volumeInfo.description}
            </Text>
          </View>
          <View mt={18} w="100%">
            <Text color="#1F0418" fontSize={12} fontWeight={500} lineHeight={16}>
              Action
            </Text>
            <View flexDirection="row" gap={2} mt={9}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.4,
                  shadowRadius: 13,
                  elevation: 5,
                }}>
                <View
                  alignItems="center"
                  justifyContent="center"
                  w="100%"
                  h={125}
                  backgroundColor="#FFFFFF"
                  borderRadius={5}>
                  <View
                    alignItems="center"
                    justifyContent="center"
                    w={60}
                    h={60}
                    backgroundColor={theme.complementaryColorTwo}
                    borderRadius={50}>
                    <MaterialCommunityIcons
                      name="book-open-page-variant"
                      size={25}
                      color="#6247AA"
                    />
                  </View>
                  <Text mt={15} color="#b8b8b8" fontSize={10} fontWeight={500}>
                    Add Pages
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.4,
                  shadowRadius: 13,
                  elevation: 5,
                  marginHorizontal: 5,
                }}>
                <View
                  alignItems="center"
                  justifyContent="center"
                  w="100%"
                  h={125}
                  backgroundColor="#FFFFFF"
                  borderRadius={5}>
                  <View
                    alignItems="center"
                    justifyContent="center"
                    w={60}
                    h={60}
                    backgroundColor={theme.complementaryColorTwo}
                    borderRadius={50}>
                    <FontAwesome name="quote-left" size={24} color="#6247AA" />
                  </View>
                  <Text mt={15} color="#b8b8b8" fontSize={10} fontWeight={500}>
                    Add Quote
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.4,
                  shadowRadius: 13,
                  elevation: 5,
                }}>
                <View
                  alignItems="center"
                  justifyContent="center"
                  w="100%"
                  h={125}
                  backgroundColor="#FFFFFF"
                  borderRadius={5}>
                  <View
                    alignItems="center"
                    justifyContent="center"
                    w={60}
                    h={60}
                    backgroundColor={theme.complementaryColorTwo}
                    borderRadius={50}>
                    <FontAwesome name="credit-card-alt" size={24} color="#6247AA" />
                  </View>
                  <Text mt={15} color="#b8b8b8" fontSize={10} fontWeight={500}>
                    Revise Flashcards
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Page;
