import { BreakpointRange, BreakpointRangeJSON } from './BreakpointRange'

export type DemoElement = 'heading1' | 'heading2' | 'paragraph'
export type DemoOffsetPosition = 'start' | 'end'

export interface GridPreferencesProps {
  id: string
  breakpointRange: BreakpointRange
  maxWidth?: number
  columns: number
  gutter: number
  margin: number
  rem: number
  demo: { [key in DemoElement]: { [key in DemoOffsetPosition]: number } }
}

export interface GridPreferencesJSON {
  id: string
  breakpointRange: BreakpointRangeJSON
  maxWidth?: number
  columns: number
  gutter: number
  margin: number
  rem: number
  demo: { [key in DemoElement]: { [key in DemoOffsetPosition]: number } }
}

export const GRID_PREFERENCES_MAX_WIDTH_LABEL = '最大幅'
export const GRID_PREFERENCES_MAX_WIDTH_UNIT = 'px'

export const GRID_PREFERENCES_COLUMNS_LABEL = 'カラム数'

export const GRID_PREFERENCES_GUTTER_LABEL = 'ガーター'
export const GRID_PREFERENCES_GUTTER_UNIT = 'px'

export const GRID_PREFERENCES_MARGIN_LABEL = 'マージン'
export const GRID_PREFERENCES_MARGIN_UNIT = 'px'

export const GRID_PREFERENCES_REM_LABEL = '基準値'
export const GRID_PREFERENCES_REM_UNIT = '%'

export const GRID_PREFERENCES_HEADING1_LABEL = '見出し1'
export const GRID_PREFERENCES_HEADING2_LABEL = '見出し2'
export const GRID_PREFERENCES_PARAGRAPH_LABEL = '段落'

export const GRID_PREFERENCES_OFFSET_POSITION_START_LABEL = '開始位置'
export const GRID_PREFERENCES_OFFSET_POSITION_END_LABEL = '終了位置'

const inRange = (value: number, min: number, max: number): boolean => {
  return min <= value && value <= max
}

export const MAX_WIDTH_MIN = 128
export const MAX_WIDTH_MAX = 1920

const isValidMaxWidth = (maxWidth?: number): boolean => {
  if (maxWidth === undefined) {
    return true
  }

  return (
    Number.isSafeInteger(maxWidth) &&
    inRange(maxWidth, MAX_WIDTH_MIN, MAX_WIDTH_MAX)
  )
}

export const COLUMNS_MIN = 1
export const COLUMNS_MAX = 12

const isValidColumns = (columns: number): boolean => {
  return (
    Number.isSafeInteger(columns) && inRange(columns, COLUMNS_MIN, COLUMNS_MAX)
  )
}

export const GUTTER_MIN = 0
export const GUTTER_MAX = 256

const isValidGutter = (gutter: number): boolean => {
  return Number.isSafeInteger(gutter) && inRange(gutter, GUTTER_MIN, GUTTER_MAX)
}

export const MARGIN_MIN = 0
export const MARGIN_MAX = 256

const isValidMargin = (margin: number): boolean => {
  return Number.isSafeInteger(margin) && inRange(margin, MARGIN_MIN, MARGIN_MAX)
}

export const REM_MIN = 1
export const REM_MAX = 2

const isValidRem = (rem: number): boolean => {
  return Number.isFinite(rem) && inRange(rem, REM_MIN, REM_MAX)
}

export const OFFSET_POSITION_MIN = COLUMNS_MIN
export const OFFSET_POSITION_MAX = COLUMNS_MAX + 1

const isValidOffsetPosition = (offsetPosition: number): boolean => {
  return (
    Number.isSafeInteger(offsetPosition) &&
    inRange(offsetPosition, COLUMNS_MIN, COLUMNS_MAX + 1)
  )
}

const isValidPosition = (
  position: { [key in DemoOffsetPosition]: number },
): boolean => {
  if (!isValidOffsetPosition(position.start)) {
    return false
  }

  if (!isValidOffsetPosition(position.end)) {
    return false
  }

  if (!(position.start < position.end)) {
    return false
  }

  return true
}

export interface SketchLayoutSettings {
  columns: {
    totalWidth: number
    offset: 0
    numberOfColumns: number
    gutterOnOutside: false
    gutterWidth: number
    columnWidth: number
  }
}

export interface FigmaLayoutGrid {
  columns: {
    count: number
    type: 'Stretch'
    width?: number
    margin: number
    gutter: number
  }
}

export class GridPreferences {
  id: string
  breakpointRange: BreakpointRange
  maxWidth?: number
  columns: number
  gutter: number
  margin: number
  rem: number
  demo: { [key in DemoElement]: { [key in DemoOffsetPosition]: number } }

  constructor({
    id,
    breakpointRange,
    maxWidth,
    columns,
    gutter,
    margin,
    rem,
    demo,
  }: GridPreferencesProps) {
    this.id = id
    this.breakpointRange = breakpointRange
    this.maxWidth = maxWidth
    this.columns = columns
    this.gutter = gutter
    this.margin = margin
    this.rem = rem
    this.demo = demo

    if (!isValidMaxWidth(this.maxWidth)) {
      throw new Error('Assertion Error')
    }

    if (!isValidColumns(this.columns)) {
      throw new Error('Assertion Error')
    }

    if (!isValidGutter(this.gutter)) {
      throw new Error('Assertion Error')
    }

    if (!isValidMargin(this.margin)) {
      throw new Error('Assertion Error')
    }

    if (!isValidRem(this.rem)) {
      throw new Error('Assertion Error')
    }

    Object.values(demo).forEach((position) => {
      if (!isValidPosition(position)) {
        throw new Error('Assertion Error')
      }
    })
  }

  updatePreference(type: 'maxWidth', value?: number): GridPreferences
  updatePreference(
    type: 'columns' | 'gutter' | 'margin' | 'rem',
    value: number,
  ): GridPreferences
  updatePreference(type: string, value: any): GridPreferences {
    return new GridPreferences({
      ...this,
      [type]: value,
    })
  }

  updateBreakpoint(
    type: 'minWidth' | 'maxWidth',
    value: number,
  ): GridPreferences {
    return new GridPreferences({
      ...this,
      breakpointRange: new BreakpointRange({
        ...this.breakpointRange,
        [type]: value,
      }),
    })
  }

  updateDemoPosition(
    element: DemoElement,
    offsetPosition: DemoOffsetPosition,
    value: number,
  ): GridPreferences {
    return new GridPreferences({
      ...this,
      demo: {
        ...this.demo,
        [element]: {
          ...this.demo[element],
          [offsetPosition]: value,
        },
      },
    })
  }

  toSketchLayoutSettings(artboardWidth: number): SketchLayoutSettings {
    if (!this.breakpointRange.matches(artboardWidth)) {
      throw new Error('')
    }

    if (this.rem !== 1) {
      throw new Error('')
    }

    const totalContainerOuterWidth = this.margin * 2
    const containerWidth =
      Math.min(
        artboardWidth,
        typeof this.maxWidth === 'number' ? this.maxWidth : Infinity,
      ) - totalContainerOuterWidth
    const totalGutterWidth = (this.columns - 1) * this.gutter

    return {
      columns: {
        totalWidth: containerWidth,
        offset: 0,
        numberOfColumns: this.columns,
        gutterOnOutside: false,
        gutterWidth: this.gutter,
        columnWidth: Math.round(
          (containerWidth - totalGutterWidth) / this.columns,
        ),
      },
    }
  }

  toFigmaLayoutGrid(artboardWidth: number): FigmaLayoutGrid {
    if (!this.breakpointRange.matches(artboardWidth)) {
      throw new Error('')
    }

    if (this.rem !== 1) {
      throw new Error('')
    }

    const totalContainerOuterWidth = this.margin * 2
    const containerWidth =
      Math.min(
        artboardWidth,
        typeof this.maxWidth === 'number' ? this.maxWidth : Infinity,
      ) - totalContainerOuterWidth

    return {
      columns: {
        count: this.columns,
        type: 'Stretch',
        margin: Math.round((artboardWidth - containerWidth) / 2),
        gutter: this.gutter,
      },
    }
  }

  static fromJSON(json: GridPreferencesJSON): GridPreferences {
    return new this({
      ...json,
      breakpointRange: BreakpointRange.fromJSON(json.breakpointRange),
    })
  }

  toJSON(): GridPreferencesJSON {
    const {
      id,
      breakpointRange,
      maxWidth,
      columns,
      gutter,
      margin,
      rem,
      demo,
    } = this
    const json = {
      id,
      breakpointRange: breakpointRange.toJSON(),
      maxWidth,
      columns,
      gutter,
      margin,
      rem,
      demo,
    }

    if (json.maxWidth === undefined) {
      delete json.maxWidth
    }

    return json
  }
}
