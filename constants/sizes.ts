import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('screen')

export const DIMENSIONS: Record<'width' | 'height', number> = {
  width,
  height,
}
