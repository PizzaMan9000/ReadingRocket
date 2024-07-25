import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { createTamagui, styled, Button, View, Text } from 'tamagui';

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    type: 'spring',
  },
  lazy: {
    damping: 20,
    type: 'spring',
    stiffness: 60,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    type: 'spring',
  },
});

const headingFont = createInterFont();

const bodyFont = createInterFont();

const EruditoThemeConfig = {
  primaryColor: '#6247AA',
  secondaryColorOne: '#A06CD5',
  secondaryColorTwo: '#062726',
  complementaryColor: '#E2CFEA',
  complementaryColorTwo: '#F9F8FC',
};

export const AuthButton = styled(Button, {
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  shadowOffset: { width: 0, height: 0 },
  borderRadius: 5,
  shadowRadius: 15,
  width: '50%',
  height: 50,
});

export const ForumContainer = styled(View, {
  marginHorizontal: 20,
  alignSelf: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});

export const UserForumText = styled(Text, {
  color: '#1F0318',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 16,
});

export const ForumHeaders = styled(Text, {
  fontWeight: 500,
  color: '#FFFFFF',
  lineHeight: 16,
  textAlign: 'center',
  fontSize: 25,
});

export const UserForumProffessionUnselected = styled(View, {
  height: 40,
  borderRadius: 5,
  backgroundColor: '#FFFFFF',
  borderWidth: 0.5,
  borderColor: '#D9D9D9',
  width: '50%',
  alignItems: 'center',
  justifyContent: 'center',
});

export const UserForumProffessionSelected = styled(View, {
  height: 40,
  borderRadius: 5,
  backgroundColor: '#F9F8FC',
  borderWidth: 2,
  borderColor: EruditoThemeConfig.primaryColor,
  width: '50%',
  alignItems: 'center',
  justifyContent: 'center',
});

export const UserForumReadingUnselected = styled(View, {
  width: '33%',
  height: 120,
  borderRadius: 5,
  borderWidth: 0.5,
  borderColor: '#D9D9D9',
  alignItems: 'center',
  justifyContent: 'center',
});

export const UserForumReadingSelected = styled(View, {
  width: '33%',
  height: 120,
  borderRadius: 5,
  borderWidth: 2,
  borderColor: EruditoThemeConfig.primaryColor,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F9F8FC',
});

const config = createTamagui({
  light: {
    color: {
      background: 'gray',
      text: 'black',
    },
  },
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes: { ...themes, erudito: EruditoThemeConfig },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
