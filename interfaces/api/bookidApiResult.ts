export interface IDBook {
  accessInfo: AccessInfo;
  etag: string;
  id: string;
  kind: string;
  saleInfo: SaleInfo;
  selfLink: string;
  volumeInfo: VolumeInfo;
}

export interface VolumeInfo {
  allowAnonLogging: boolean;
  authors: string[];
  canonicalVolumeLink: string;
  categories: string[];
  contentVersion: string;
  description: string;
  dimensions: Dimensions;
  imageLinks: ImageLinks;
  industryIdentifiers: Function[][];
  infoLink: string;
  language: string;
  maturityRating: string;
  pageCount: number;
  panelizationSummary: PanelizationSummary;
  previewLink: string;
  printType: string;
  printedPageCount: number;
  publishedDate: string;
  publisher: string;
  readingModes: ReadingModes;
  subtitle: string;
  title: string;
}

export interface ReadingModes {
  image: boolean;
  text: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  extraLarge: string;
  large: string;
  medium: string;
  small: string;
  smallThumbnail: string;
  thumbnail: string;
}

export interface Dimensions {
  height: string;
  thickness: string;
  width: string;
}

export interface SaleInfo {
  country: string;
  isEbook: boolean;
  saleability: string;
}

export interface AccessInfo {
  accessViewStatus: string;
  country: string;
  embeddable: boolean;
  epub: Epub;
  pdf: Pdf;
  publicDomain: boolean;
  quoteSharingAllowed: boolean;
  textToSpeechPermission: string;
  viewability: string;
  webReaderLink: string;
}

export interface Pdf {
  acsTokenLink: string;
  isAvailable: boolean;
}

export interface Epub {
  isAvailable: boolean;
}
