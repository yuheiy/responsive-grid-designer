import { createEvent, createStore, combine } from 'effector'
import { DemoElement } from '../../domain/GridPreferences'
import { $gridSystem } from '../document/store'

export const resizeViewportWidth = createEvent<number>('resizeViewportWidth')

export const $viewportWidth = createStore<number>(0).on(
  resizeViewportWidth,
  (_, viewportWidth) => viewportWidth,
)

// avoid re-render
export const $gridPreferencesMatchedByViewportWidth = combine(
  $gridSystem,
  $viewportWidth,
  (gridSystem, viewportWidth) => {
    return gridSystem.getMatched(viewportWidth)
  },
)

export const ARTBOARD_WIDTH_LABEL = 'アートボードの幅'
export const ARTBOARD_WIDTH_UNIT = 'px'

export const resizeArtboardWidth = createEvent<number>('resizeArtboardWidth')

export const $artboardWidth = createStore<number>(1440).on(
  resizeArtboardWidth,
  (_, artboardWidth) => artboardWidth,
)

// avoid re-render
export const $gridPreferencesMatchedByArtboardWidth = combine(
  $gridSystem,
  $artboardWidth,
  (gridSystem, artboardWidth) => {
    return gridSystem.getMatched(artboardWidth)
  },
)

export const toggleGridGuide = createEvent<boolean | undefined>(
  'toggleGridGuide',
)

export const $displaysGridGuide = createStore<boolean>(false).on(
  toggleGridGuide,
  (state, force) => {
    if (typeof force === 'boolean') {
      return force
    }

    return !state
  },
)

type HighlightableGridGuide = 'columns' | 'gutter' | 'margin' | 'maxWidth'

type HighlightableElementGuide =
  | 'heading1:offsetPosition'
  | 'heading1:fontSize'
  | 'heading2:offsetPosition'
  | 'heading2:fontSize'
  | 'paragraph:offsetPosition'
  | 'paragraph:fontSize'

export const highlightGuide = createEvent<
  | {
      gridPreferencesId: string
      guide: HighlightableGridGuide
    }
  | {
      guide: HighlightableElementGuide
    }
>('highlighGuide')

export const unhighlightGuide = createEvent('unhighlightGuide')

export const $highlightsGuide = combine(
  createStore<{
    gridPreferencesId?: string
    guide?: HighlightableGridGuide | HighlightableElementGuide
  }>({})
    .on(highlightGuide, (_, payload) => {
      return payload
    })
    .on(unhighlightGuide, () => {
      return {}
    }),
  $gridPreferencesMatchedByViewportWidth,
  ({ gridPreferencesId, guide }, gridPreferencesMatchedByViewportWidth) => {
    const matches =
      gridPreferencesId ===
      (gridPreferencesMatchedByViewportWidth &&
        gridPreferencesMatchedByViewportWidth.id)
    return {
      columns: matches && guide === 'columns',
      gutter: matches && guide === 'gutter',
      margin: matches && guide === 'margin',
      maxWidth: matches && guide === 'maxWidth',
      heading1OffsetPosition: guide === 'heading1:offsetPosition',
      heading1FontSize: guide === 'heading1:fontSize',
      heading2OffsetPosition: guide === 'heading2:offsetPosition',
      heading2FontSize: guide === 'heading2:fontSize',
      paragraphOffsetPosition: guide === 'paragraph:offsetPosition',
      paragraphFontSize: guide === 'paragraph:fontSize',
    }
  },
)

export const FONT_SIZE_LABEL = 'フォントサイズ'
export const FONT_SIZE_UNIT = 'px'

export const changeFontSize = createEvent<{
  type: DemoElement
  value: number
}>('changeFontSize')

export const resetFontSize = createEvent()

export const defaultFontSizeMap = {
  heading1: 48,
  heading2: 32,
  paragraph: 16,
}

export const $fontSize = createStore<{ [key in DemoElement]: number }>(
  defaultFontSizeMap,
)
  .on(changeFontSize, (state, { type, value }) => {
    return {
      ...state,
      [type]: value,
    }
  })
  .reset(resetFontSize)

export type PanelSide = 'leftTop' | 'leftBottom' | 'rightBottom' | 'rightTop'

export const changePanelSide = createEvent<PanelSide>('changePanelSide')

export const $panelSide = createStore<PanelSide>('rightBottom').on(
  changePanelSide,
  (_, panelSide) => panelSide,
)
