export interface SearchedImage {
  total: number;
  total_pages: number;
  results: Result[];
}

export interface Result {
  id: string;
  slug: string;
  alternative_slugs: Alternativeslugs;
  created_at: string;
  updated_at: string;
  promoted_at: null | string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: null | string;
  alt_description: string;
  breadcrumbs: Breadcrumb[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: null;
  topic_submissions: Topicsubmissions;
  asset_type: string;
  user: User;
  tags: Tag[];
}

export interface Tag {
  type: string;
  title: string;
  source?: Source;
}

export interface Source {
  ancestry: Ancestry;
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  cover_photo: Coverphoto;
}

export interface Coverphoto {
  id: string;
  slug: string;
  alternative_slugs: Alternativeslugs;
  created_at: string;
  updated_at: string;
  promoted_at: null | null | string | string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: null | string | string;
  alt_description: string;
  breadcrumbs: (Breadcrumb | Breadcrumb)[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: null;
  topic_submissions: Topicsubmissions2;
  asset_type: string;
  premium: boolean;
  plus: boolean;
  user: User2;
}

export interface User2 {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: null | null | string | string;
  portfolio_url: null | string | string;
  bio: string;
  location: string;
  links: Links2;
  profile_image: Profileimage;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social2;
}

export interface Social2 {
  instagram_username: string;
  portfolio_url: null | string | string;
  twitter_username: null | null | string | string;
  paypal_email: null;
}

export interface Topicsubmissions2 {
  'architecture-interior'?: Wallpapers;
  'color-of-water'?: Wallpapers;
  wallpapers?: Wallpapers;
  blue?: Wallpapers;
  'textures-patterns'?: Wallpapers;
  nature?: Wallpapers;
}

export interface Ancestry {
  type: Type;
  category?: Type;
  subcategory?: Type;
}

export interface Type {
  slug: string;
  pretty_slug: string;
}

export interface User {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: null | string;
  portfolio_url: null | string;
  bio: null | string;
  location: null | string;
  links: Links2;
  profile_image: Profileimage;
  instagram_username: null | string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

export interface Social {
  instagram_username: null | string;
  portfolio_url: null | string;
  twitter_username: null | string;
  paypal_email: null;
}

export interface Profileimage {
  small: string;
  medium: string;
  large: string;
}

export interface Links2 {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

export interface Topicsubmissions {
  nature?: Nature;
  wallpapers?: Wallpapers;
}

export interface Wallpapers {
  status: string;
  approved_on: string;
}

export interface Nature {
  status: string;
  approved_on?: string;
}

export interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

export interface Breadcrumb {
  slug: string;
  title: string;
  index: number;
  type: string;
}

export interface Alternativeslugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
}
