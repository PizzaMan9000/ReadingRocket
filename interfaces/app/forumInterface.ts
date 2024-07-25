export interface dataSaved {
  id: string;
  title: string;
  pageCount?: number;
  cover?: string;
  authors?: string[];
}

export interface pageAndID {
  pageCount: number;
  id: string;
  pagesRead: number;
}
