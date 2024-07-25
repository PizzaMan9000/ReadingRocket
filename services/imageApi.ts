import AsyncStorage from '@react-native-async-storage/async-storage';

import { SearchedImage } from '@/interfaces/api/imageApiResults';

export const getImageSearchResults = async (query: string): Promise<SearchedImage> => {
  // Set up api key
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${Math.floor(Math.random() * 200) + 1}&client_id=53M-erpai6GLcd7_RX97b_RJbmTgOkmYgjw9B_51jrU`
  );

  console.log(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=53M-erpai6GLcd7_RX97b_RJbmTgOkmYgjw9B_51jrU`
  );

  const json = await response.json();

  try {
    AsyncStorage.setItem('@ImageQueryData', JSON.stringify(json));
  } catch (e) {
    console.log('🚀 ~ getImageSearchResults ~ error:', e);
  } finally {
    return json;
  }
};
