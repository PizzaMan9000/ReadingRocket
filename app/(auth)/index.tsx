import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, Text, Image } from 'tamagui';

const Page = () => {
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <View>
        <Image source={{uri: 'https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg', width: 36, height: 36}} borderRadius={100} borderWidth={2} borderColor="#FFFFFF" />
      </View>
    </SafeAreaView>
  );
};

export default Page;
