import { Entypo, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Input, RadioGroup, YStack, Text, useTheme } from 'tamagui';

import ToggleGroupText from '@/components/forum/ToggleGroupText';
import { RadioGroupItemWithLabel } from '@/components/forum/radioGroupLabel';
import { supabase } from '@/services/clients/supabase';
import {
  UserForumProffessionSelected,
  UserForumProffessionUnselected,
  UserForumReadingUnselected,
  UserForumText,
  UserForumReadingSelected,
  ForumContainer,
} from '@/tamagui.config';

const Page = () => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState<'job' | 'student'>('student');
  const [readingCategory, setReadingCategory] = useState<'fiction' | 'nonfiction' | 'both'>(
    'fiction'
  );
  const [typeOfReader, setTypeOfReader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  const submitForum = async () => {
    if (name.includes(' ')) {
      setErrorMessage('first name needs to have no spaces');
      return;
    } else if (name.length < 3) {
      setErrorMessage('first name needs to have more than three characters');
      return;
    } else if (name === '') {
      setErrorMessage('Please fill in the first name box');
      return;
    }

    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const forumData = {
      user_id: User?.id,
      name,
      profession,
      type_of_reader: typeOfReader,
      reading_category: readingCategory,
    };

    try {
      await AsyncStorage.setItem('@forumData', JSON.stringify(forumData));
    } catch (e) {
      // Do the error handling
      console.log(e);
    } finally {
      router.push('/forum/selectBooks');
    }
  };

  return (
    <LinearGradient
      colors={['#6247AA', '#A06CD5']}
      end={{ x: 0.9, y: 0.7 }}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text mb={8} color="#FF0000" fontWeight={400} textAlign="center">
        {errorMessage}
      </Text>
      <ForumContainer p={30}>
        <View>
          <UserForumText>Whats your first name</UserForumText>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="John"
            width="100%"
            height={44}
            flexShrink={0}
            borderRadius={5}
            borderWidth={0.5}
            borderColor="#D9D9D9"
            placeholderTextColor="#D9D9D9"
            fontSize={10}
            fontWeight={400}
            lineHeight={16}
            letterSpacing={0.5}
            mt={8}
          />
        </View>
        <View mt={20}>
          <UserForumText mb={8}>Describe your profession</UserForumText>
          {profession === 'student' ? (
            <View flexDirection="row" w="100%" alignItems="center" justifyContent="center">
              <UserForumProffessionSelected
                onPress={() => setProfession('student')}
                mr={6}
                flexDirection="row">
                <Entypo name="graduation-cap" size={20} color="#6247AA" />
                <ToggleGroupText value="Student" color={theme.primaryColor} marginLeftValue={6} />
              </UserForumProffessionSelected>
              <UserForumProffessionUnselected
                onPress={() => setProfession('job')}
                flexDirection="row">
                <FontAwesome name="briefcase" size={20} color="#B8B8B8" />
                <ToggleGroupText value="Adult with job" color="#B8B8B8" marginLeftValue={6} />
              </UserForumProffessionUnselected>
            </View>
          ) : (
            <View flexDirection="row" w="100%" alignItems="center" justifyContent="center">
              <UserForumProffessionUnselected
                onPress={() => setProfession('student')}
                mr={6}
                flexDirection="row">
                <Entypo name="graduation-cap" size={20} color="#B8B8B8" />
                <ToggleGroupText value="Student" color="#B8B8B8" marginLeftValue={6} />
              </UserForumProffessionUnselected>
              <UserForumProffessionSelected
                onPress={() => setProfession('job')}
                flexDirection="row">
                <FontAwesome name="briefcase" size={20} color="#6247AA" />
                <ToggleGroupText
                  value="Adult with job"
                  color={theme.primaryColor}
                  marginLeftValue={6}
                />
              </UserForumProffessionSelected>
            </View>
          )}
        </View>
        <View mt={24}>
          <UserForumText>Are you a frequent reader</UserForumText>
          <RadioGroup
            aria-labelledby="Select one item"
            value={typeOfReader}
            defaultValue="frequent_reader"
            name="form"
            onValueChange={(value: string) => setTypeOfReader(value)}>
            <YStack width={300} alignItems="center" space="$2">
              <RadioGroupItemWithLabel
                size="$3"
                value="frequent_reader"
                label="Yes, I am a frequent reader"
              />
              <RadioGroupItemWithLabel size="$3" value="time_to_time" label="From time to time" />
              <RadioGroupItemWithLabel size="$3" value="barely_reads" label="Once a week, barely" />
            </YStack>
          </RadioGroup>
        </View>
        <View mt={22}>
          <UserForumText>What do you read?</UserForumText>
          <View flexDirection="row" mt={9}>
            {readingCategory === 'fiction' && (
              <View flexDirection="row" mt={9} justifyContent="center" alignItems="center">
                <UserForumReadingSelected onPress={() => setReadingCategory('fiction')}>
                  <Entypo name="open-book" size={37} color="#6247AA" />
                  <ToggleGroupText value="Fiction" color={theme.primaryColor} marginTopValue={16} />
                </UserForumReadingSelected>
                <UserForumReadingUnselected
                  marginHorizontal={4}
                  onPress={() => setReadingCategory('nonfiction')}>
                  <FontAwesome6 name="address-book" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Non fiction" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
                <UserForumReadingUnselected w="33%" onPress={() => setReadingCategory('both')}>
                  <FontAwesome6 name="arrows-turn-to-dots" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Both" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
              </View>
            )}
            {readingCategory === 'nonfiction' && (
              <View flexDirection="row" mt={9} justifyContent="center" alignItems="center">
                <UserForumReadingUnselected onPress={() => setReadingCategory('fiction')}>
                  <Entypo name="open-book" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Fiction" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
                <UserForumReadingSelected
                  marginHorizontal={4}
                  onPress={() => setReadingCategory('nonfiction')}>
                  <FontAwesome6 name="address-book" size={37} color="#6247AA" />
                  <ToggleGroupText
                    value="Non fiction"
                    color={theme.primaryColor}
                    marginTopValue={16}
                  />
                </UserForumReadingSelected>
                <UserForumReadingUnselected w="33%" onPress={() => setReadingCategory('both')}>
                  <FontAwesome6 name="arrows-turn-to-dots" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Both" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
              </View>
            )}
            {readingCategory === 'both' && (
              <View flexDirection="row" mt={9} justifyContent="center" alignItems="center">
                <UserForumReadingUnselected onPress={() => setReadingCategory('fiction')}>
                  <Entypo name="open-book" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Fiction" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
                <UserForumReadingUnselected
                  marginHorizontal={4}
                  onPress={() => setReadingCategory('nonfiction')}>
                  <FontAwesome6 name="address-book" size={37} color="#B9B9B9" />
                  <ToggleGroupText value="Non fiction" color="#B8B8B8" marginTopValue={16} />
                </UserForumReadingUnselected>
                <UserForumReadingSelected w="33%" onPress={() => setReadingCategory('both')}>
                  <FontAwesome6 name="arrows-turn-to-dots" size={37} color="#6247AA" />
                  <ToggleGroupText value="Both" color={theme.primaryColor} marginTopValue={16} />
                </UserForumReadingSelected>
              </View>
            )}
          </View>
        </View>
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
        onPress={submitForum}>
        <Text color="#FFFFFF" mr={8} fontSize={20} fontWeight={800} letterSpacing={2}>
          NEXT
        </Text>
        <FontAwesome name="arrow-right" size={24} color="#FFFFFF" />
      </View>
    </LinearGradient>
  );
};

export default Page;
