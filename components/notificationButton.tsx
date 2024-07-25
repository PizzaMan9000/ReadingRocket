import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { View, useTheme } from 'tamagui';

const NotificationButton = () => {
  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  return (
    <View
      w={38}
      h={38}
      bc={theme.complementaryColor}
      borderRadius={100}
      alignItems="center"
      justifyContent="center">
      <Ionicons name="notifications-outline" size={25} color="#6247AA" />
    </View>
  );
};

export default memo(NotificationButton);
