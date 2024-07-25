import { SearchedBook } from '@/interfaces/api/bookApiResults';
import { IDBook } from '@/interfaces/api/bookidApiResult';

export const getSearchResults = async (
  query: string,
  startIndex: number
): Promise<SearchedBook> => {
  // set up environment api key
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyAojEgo-XgYGjxYxSJsO-por0zaoprtkn0&maxResults=40&startIndex=${encodeURIComponent(startIndex)}`
  );

  const json = await response.json();

  return json;
};

export const getIDSearchResults = async (query: string): Promise<IDBook> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(query)}`
  );
  //console.log(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(query)}`);

  const json = await response.json();
  //console.log('🚀 ~ getIDSearchResults ~ json:', json);

  return json;
};
