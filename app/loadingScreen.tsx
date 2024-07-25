import { View, Text } from 'tamagui'
import React from 'react'
import { SafeAreaView } from 'react-native';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </SafeAreaView>
  )
}

export default LoadingScreen;