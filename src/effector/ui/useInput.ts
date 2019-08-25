import { useRequiredNumberInputWithNormalization } from '../../hooks/useNumberInput'
import { DemoElement } from '../../domain/GridPreferences'
import { useStore } from 'effector-react'
import {
  $fontSize,
  changeFontSize,
  unhighlightGuide,
  highlightGuide,
  $artboardWidth,
  resizeArtboardWidth,
  defaultFontSizeMap,
} from './store'

export const useArtboardWidthInput = () => {
  const artboardWidth = useStore($artboardWidth)
  const inputProps = useRequiredNumberInputWithNormalization({
    value: artboardWidth,
    min: 320,
    max: 1920,
    changeValue: (value) => {
      resizeArtboardWidth(value)
    },
  })
  return inputProps
}

export const useDemoFontSizeInput = (element: DemoElement) => {
  const fontSize = useStore($fontSize)
  const baseProps = useRequiredNumberInputWithNormalization({
    value: fontSize[element],
    min: 12,
    max: 128,
    changeValue: (value) => {
      changeFontSize({ type: element, value })
    },
    onFocus: () => {
      highlightGuide({
        guide: `${element}:fontSize` as
          | 'heading1:fontSize'
          | 'heading2:fontSize'
          | 'paragraph:fontSize',
      })
    },
    onBlur: () => {
      unhighlightGuide()
    },
  })
  const inputProps = {
    ...baseProps,
    placeholder: String(defaultFontSizeMap[element]),
  }
  return inputProps
}
