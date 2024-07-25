import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { View, useTheme } from 'tamagui';

interface backButtonProps {
  marginLeft: number;
  marginTop: number;
  absolute: boolean;
}

const BackButton = ({ marginLeft, marginTop, absolute }: backButtonProps) => {
  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const router = useRouter();

  return (
    <>
      {absolute ? (
        <View
          position="absolute"
          backgroundColor={theme.complementaryColor}
          w={38}
          h={38}
          alignItems="center"
          justifyContent="center"
          ml={marginLeft}
          mt={marginTop}
          borderRadius={100}
          onPress={() => router.back()}>
          <View mr={2}>
            <AntDesign name="arrowleft" size={24} color="#6247AA" />
          </View>
        </View>
      ) : (
        <View
          backgroundColor={theme.complementaryColor}
          w={38}
          h={38}
          alignItems="center"
          justifyContent="center"
          ml={marginLeft}
          mt={marginTop}
          borderRadius={100}
          onPress={() => router.back()}>
          <View mr={2}>
            <MaterialCommunityIcons name="less-than" size={25} color="#6247AA" />
          </View>
        </View>
      )}
    </>
  );
};

export default memo(BackButton);
