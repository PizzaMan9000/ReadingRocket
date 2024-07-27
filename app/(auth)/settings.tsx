import React from 'react';
import { View, Button } from 'tamagui';

import { supabase } from '@/services/clients/supabase';

const Page = () => {
  const logout = async () => {
    console.log('logging out...');
    supabase.auth.signOut();
    console.log('logged out');
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
