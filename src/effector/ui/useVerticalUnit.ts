import { useStore } from 'effector-react'
import { $fontSize } from './store'

export const lineHeight = {
  heading: 1.25,
  paragraph: 1.75,
}

export const useVerticalUnit = () => {
  const fontSize = useStore($fontSize)
  return fontSize.paragraph * lineHeight.paragraph
}
