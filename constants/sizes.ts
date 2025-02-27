import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('screen')

export type SizeKeys = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export const SIZES: Record<SizeKeys, number> = {
  h1: 27,
  h2: 22,
  h3: 19,
  h4: 17,
  h5: 15,
  h6: 13,
}

export const DIMENSIONS: Record<'width' | 'height', number> = {
  width,
  height,
}
