import React from 'react';
import { View, Button } from 'tamagui';

import { supabase } from '@/services/clients/supabase';
import useBooksStore from '@/store/booksStore';
import useProgressStore from '@/store/progressStore';

const Page = () => {
  const { bookIdsPage, setBooks, setBookIdsPage, setSelectedBooks } = useBooksStore();
  const { setDailyPagesRead, setReadingGoals } = useProgressStore();

  const logout = async () => {
    console.log('logging out...');
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    // Reseting Values
    setDailyPagesRead(0);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('error detected!', error);
    }

    if (User) {
      for await (const IdsPage of bookIdsPage) {
        await supabase
          .from('user_books')
          .update({ pages_read: IdsPage.pagesRead.toString() })
          .eq('user_id', User.id)
          .eq('bookid', IdsPage.id)
          .neq('pages_read', IdsPage.pagesRead.toString());
        console.log('update complete!');
      }
    }

    setBookIdsPage([]);
    setBooks([]);
    setSelectedBooks([]);
    setReadingGoals(0);
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
