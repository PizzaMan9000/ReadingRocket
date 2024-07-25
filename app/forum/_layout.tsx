import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="selectBooks" />
      <Stack.Screen name="userForum" />
      <Stack.Screen name="bookInfo" />
    </Stack>
  );
};

export default Layout;
