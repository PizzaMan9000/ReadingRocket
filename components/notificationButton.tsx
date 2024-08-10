import { Ionicons } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { View, useTheme } from 'tamagui';

import useGlobalStore from '@/store/globalStore';

const NotificationButton = () => {
  const [iconName, setIconName] = useState<'notifications-outline' | 'notifications-off-outline'>(
    'notifications-outline'
  );
  const { notificationsOn, setNotificationsOn } = useGlobalStore();

  const theme = useTheme() as {
    complementaryColorTwo: string;
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const toggleNotification = () => {
    if (notificationsOn === true) {
      setNotificationsOn(false);
      setIconName('notifications-off-outline');
    } else {
      setNotificationsOn(true);
      setIconName('notifications-outline');
    }
  };

  return (
    <View
      w={38}
      h={38}
      bc={theme.complementaryColor}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      onPress={() => toggleNotification()}>
      <Ionicons name={iconName} size={25} color="#6247AA" />
    </View>
  );
};

export default memo(NotificationButton);
