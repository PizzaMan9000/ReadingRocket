import { useRouter } from 'expo-router';
import React from 'react';
import { View, Button } from 'tamagui';

import { supabase } from '@/services/supabase';

const Page = () => {
  const router = useRouter();

  const logout = async () => {
    // console.log('logging out...')
    // supabase.auth.signOut()
    // console.log('logged out')
    router.replace('/');
  };

  return (
    <View>
      <Button onPress={logout} bc="red" mt={30}>
        Logout
      </Button>
    </View>
  );
};

export default Page;
