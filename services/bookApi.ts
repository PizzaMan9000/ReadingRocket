import { SearchedBook } from '@/interfaces/bookApiResults';

export const getSearchResults = async (query: string): Promise<SearchedBook> => {
  // set up environment api key
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyAojEgo-XgYGjxYxSJsO-por0zaoprtkn0&maxResults=40`
  );

  const json = await response.json();
  console.log('🚀 ~ getSearchResults ~ json:', json);

  return json;
};
