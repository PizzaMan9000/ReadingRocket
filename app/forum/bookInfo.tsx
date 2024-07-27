import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, useTheme } from 'tamagui';

import BackButton from '@/components/backButton';
import BookItem from '@/components/forum/BookItem';
import useBooksStore from '@/store/booksStore';
import { ForumContainer, ForumHeaders } from '@/tamagui.config';

const Page = () => {
  const { bookIdsPage } = useBooksStore();
  const [error, setError] = useState(false);

  const router = useRouter();

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  useEffect(() => {
    console.log('Book Ids Page', bookIdsPage);
  }, [bookIdsPage]);

  const submitData = async () => {
    let hasError = false;

    for (let i = 0; i < bookIdsPage.length; i++) {
      const book = bookIdsPage[i]; // Extract the current book for readability

      if (book && book.pageCount !== undefined && book.pagesRead >= book.pageCount) {
        hasError = true;
        console.log('HEY THERES AN ERROR');
        break; // Exit the loop early if an error is found
      }
    }

    setError(hasError);

    if (!hasError) {
      router.push('/forum/loading');
    }
  };

  useEffect(() => {
    console.log('🚀 ~ Page ~ allSelectedPagesIds:', bookIdsPage);
  }, [bookIdsPage]);

  return (
    <LinearGradient
      colors={['#6247AA', '#A06CD5']}
      end={{ x: 0.9, y: 0.7 }}
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
      }}>
      <BackButton absolute marginLeft={20} marginTop={60} />
      <ForumHeaders paddingTop={20} mt={105}>
        Update your book data
      </ForumHeaders>
      <View alignItems="center" justifyContent="center">
        {error && (
          <Text color="#FF0000">Please make sure your pages read is lower than your pages</Text>
        )}
        <ForumContainer h={500} w="80%" mt={80}>
          <ScrollView>
            {bookIdsPage.map((item) => (
              <BookItem id={item.id} key={item.id} />
            ))}
          </ScrollView>
        </ForumContainer>
        <View
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          bc={theme.primaryColor}
          mt={10}
          paddingVertical={15}
          paddingHorizontal={50}
          borderRadius={10}
          onPress={() => submitData()}>
          <Text color="#FFFFFF" mr={8} fontSize={20} fontWeight={800} letterSpacing={2}>
            NEXT
          </Text>
          <FontAwesome name="arrow-right" size={24} color="#FFFFFF" />
        </View>
      </View>
    </LinearGradient>
  );
};

export default Page;
