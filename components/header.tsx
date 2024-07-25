import React, { memo } from 'react';
import { View, Text } from 'tamagui';

import BackButton from './backButton';
import NotificationButton from './notificationButton';

interface HeaderProps {
  headerValue: string;
  backMarginLeft: number;
  backMarginTop: number;
  backAbsolute: boolean;
}

const Header = ({ headerValue, backMarginLeft, backMarginTop, backAbsolute }: HeaderProps) => {
  return (
    <View w="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
      <BackButton marginLeft={backMarginLeft} marginTop={backMarginTop} absolute={backAbsolute} />
      <Text color="#3B3B3B" fontSize={12} fontWeight={500} lineHeight={16}>
        {headerValue}
      </Text>
      <NotificationButton />
    </View>
  );
};

export default memo(Header);
