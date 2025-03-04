/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type ColorKeys = 'primary' | 'secondary'

type ColorsType = {
  primary: Record<number, string>
  secondary: Record<number, string>
  accent: string
  error: string
}

export const COLORS: ColorsType = {
  primary: {
    100: '#cee9f0',
    200: '#9cd3e0',
    300: '#6bbdd1',
    400: '#39a7c1',
    500: '#0891b2', // title / accent
    600: '#06748e',
    700: '#05576b',
    800: '#033a47',
    900: '#021d24', // text
  },
  secondary: {
    100: '#f3f3f3', // inputs
    200: '#e6e6e6', // Health information
    300: '#ababab',
    400: '#8f8f8f',
    500: '#737373', // placeholder
    600: '#5c5c5c',
    700: '#454545',
    800: '#2e2e2e',
    900: '#171717',
  },
  accent: '#c6c9ff',
  error: '#d71818',
}
