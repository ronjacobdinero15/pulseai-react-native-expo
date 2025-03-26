/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type ColorsType = {
  primary: Record<number, string>
  secondary: Record<number, string>
  success: string
  error: string
  warning: string
}

export const COLORS: ColorsType = {
  primary: {
    100: '#d4e3d9',
    200: '#a9c7b4',
    300: '#7eaa8e',
    400: '#538e69',
    500: '#287243',
    600: '#205b36',
    700: '#184428',
    800: '#102e1b',
    900: '#08170d',
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
  success: '#0adb70',
  error: '#d9544d',
  warning: '#f5d224',
}
