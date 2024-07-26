import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { View, Text, useTheme, Spinner, Input } from 'tamagui';

import { pageAndID } from '@/interfaces/app/forumInterface';
import { getIDSearchResults } from '@/services/api/bookApi';

interface BookItemProps {
  id: string;
}

const BookItem = ({ id }: BookItemProps) => {
  const [pages, setPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [mandatory, setMandatory] = useState(false);

  const idQuery = useQuery({
    queryKey: ['idSearch', id],
    queryFn: () => getIDSearchResults(id),
  });

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const savePages = async () => {
    try {
      const selectedPagesIds = await AsyncStorage.getItem('@currentPagesBookIds');
      if (selectedPagesIds) {
        const parsedPagesIds: pageAndID[] = JSON.parse(selectedPagesIds);
        for (let i = 0; i < parsedPagesIds.length; i++) {
          if (idQuery.data && !idQuery.isError) {
            if (parsedPagesIds[i].id === idQuery.data.id) {
              if (!pages) {
                if (idQuery.data.volumeInfo.pageCount) {
                  parsedPagesIds[i].pageCount = idQuery.data.volumeInfo.pageCount;
                  await AsyncStorage.setItem(
                    '@currentPagesBookIds',
                    JSON.stringify(parsedPagesIds)
                  );
                  console.log('query reset done!');
                }
              } else {
                parsedPagesIds[i].pageCount = parseInt(pages, 10);
                await AsyncStorage.setItem('@currentPagesBookIds', JSON.stringify(parsedPagesIds));
                console.log('input value added!');
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('🚀 ~ savePages ~ error:', e);
    }
  };

  const savePagesRead = async () => {
    try {
      const selectedPagesIds = await AsyncStorage.getItem('@currentPagesBookIds');
      if (selectedPagesIds) {
        const parsedPagesIds: pageAndID[] = JSON.parse(selectedPagesIds);
        for (let i = 0; i < parsedPagesIds.length; i++) {
          if (idQuery.data && !idQuery.isError) {
            if (parsedPagesIds[i].id === idQuery.data.id) {
              if (!pagesRead) {
                if (idQuery.data.volumeInfo.pageCount) {
                  parsedPagesIds[i].pagesRead = 0;
                  await AsyncStorage.setItem(
                    '@currentPagesBookIds',
                    JSON.stringify(parsedPagesIds)
                  );
                  console.log('reset done!');
                }
              } else {
                parsedPagesIds[i].pagesRead = parseInt(pagesRead, 10);
                await AsyncStorage.setItem('@currentPagesBookIds', JSON.stringify(parsedPagesIds));
                console.log('input value added!');
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('🚀 ~ savePagesRead ~ error:', e);
    }
  };

  useEffect(() => {
    savePages();
  }, [pages]);

  useEffect(() => {
    savePagesRead();
  }, [pagesRead]);

  useEffect(() => {
    if (!idQuery.data?.volumeInfo.hasOwnProperty('pageCount')) {
      setMandatory(true);
    } else {
      setMandatory(false);
    }
  }, [idQuery.data]);

  return (
    <View w="100%" paddingVertical={10} paddingHorizontal={10}>
      {idQuery.isLoading && <Spinner size="large" color="#6247AA" />}
      {idQuery.data && (
        <View
          borderBottomColor="#A9A9A9"
          borderTopColor="rgba(0,0,0,0)"
          borderLeftColor="rgba(0,0,0,0)"
          borderRightColor="rgba(0,0,0,0)"
          borderWidth={2}
          flexDirection="row"
          paddingBottom={10}
          alignItems="flex-end">
          {idQuery.data.volumeInfo.imageLinks ? (
            <Image
              source={{
                uri: idQuery.data.volumeInfo.imageLinks?.smallThumbnail,
                width: 52.5,
                height: 85.5,
              }}
            />
          ) : (
            <View
              w={52.5}
              height={85.5}
              backgroundColor={theme.complementaryColor}
              alignItems="center"
              justifyContent="center"
              mb={10}>
              <Ionicons name="warning-outline" size={18} color={theme.primaryColor} />
              <Text fontSize={11} color={theme.primaryColor} fontWeight={500} textAlign="center">
                There isn't any cover found for this book
              </Text>
            </View>
          )}
          <View flexDirection="column" bottom={0} ml={5} flex={1}>
            <Text
              numberOfLines={1}
              color={theme.primaryColor}
              fontSize={10}
              fontWeight={500}
              lineHeight={16}>
              {idQuery.data.volumeInfo.authors}
            </Text>
            <Text numberOfLines={2} mt={5} fontSize={11} fontWeight={500} lineHeight={16}>
              {idQuery.data.volumeInfo.title}
            </Text>
          </View>
          <View flexDirection="row">
            <View flexDirection="column">
              {mandatory && (
                <Text color="#FF0000" fontSize={5}>
                  This field is mandatory
                </Text>
              )}
              <Text>Pages</Text>
              <Input
                h="30"
                placeholder={idQuery.data.volumeInfo.pageCount?.toString()}
                keyboardType="numeric"
                value={pages}
                onChangeText={(text) => setPages(text)}
              />
            </View>
            <View flexDirection="column">
              <Text>Pages Read</Text>
              <Input
                h="30"
                placeholder="0"
                keyboardType="numeric"
                value={pagesRead}
                onChangeText={(text) => setPagesRead(text)}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BookItem;
