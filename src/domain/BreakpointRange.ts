export interface BreakpointRangeProps {
  minWidth: number
  maxWidth: number
}

export interface BreakpointRangeJSON {
  minWidth: number
  maxWidth?: number
}

export const BREAKPOINT_RANGE_MIN_WIDTH_LABEL = '最小幅'
export const BREAKPOINT_RANGE_MAX_WIDTH_LABEL = '最大幅'

export const BREAKPOINT_RANGE_LABEL = 'ブレイクポイントの範囲'

const inRange = (value: number, min: number, max: number): boolean => {
  return min <= value && value <= max
}

export const VIEWPORT_WIDTH_MIN = 0
export const VIEWPORT_WIDTH_MAX = 9999

const isValidViewportWidth = (viewportWidth: number): boolean => {
  return (
    Number.isSafeInteger(viewportWidth) &&
    inRange(viewportWidth, VIEWPORT_WIDTH_MIN, VIEWPORT_WIDTH_MAX)
  )
}

const isValidMinViewportWidth = (viewportWidth: number): boolean => {
  return (
    isValidViewportWidth(viewportWidth) &&
    viewportWidth <= VIEWPORT_WIDTH_MAX - 1
  )
}

const isValidMaxViewportWidth = (viewportWidth: number): boolean => {
  if (viewportWidth === Infinity) {
    return true
  }

  return (
    isValidViewportWidth(viewportWidth) &&
    VIEWPORT_WIDTH_MIN + 1 <= viewportWidth
  )
}

const isValidBreakpointRange = (breakpointRange: BreakpointRange): boolean => {
  if (!isValidMinViewportWidth(breakpointRange.minWidth)) {
    return false
  }

  if (!isValidMaxViewportWidth(breakpointRange.maxWidth)) {
    return false
  }

  if (!(breakpointRange.minWidth < breakpointRange.maxWidth)) {
    return false
  }

  return true
}

export class BreakpointRange {
  minWidth: number
  maxWidth: number

  constructor({ minWidth, maxWidth }: BreakpointRangeProps) {
    this.minWidth = minWidth
    this.maxWidth = maxWidth

    if (!isValidBreakpointRange(this)) {
      throw new Error('Assertion Error')
    }
  }

  get rangeSymbol(): string {
    return this.isToEndingPoint ? '+' : '–'
  }

  get isFromStartingPoint(): boolean {
    return this.minWidth === VIEWPORT_WIDTH_MIN
  }

  get isToEndingPoint(): boolean {
    return this.maxWidth === Infinity
  }

  get label(): string {
    if (this.isToEndingPoint) {
      return `${this.minWidth} ${this.rangeSymbol}`
    }

    return `${this.minWidth} ${this.rangeSymbol} ${this.maxWidth}`
  }

  matches(viewportWidth: number): boolean {
    return inRange(viewportWidth, this.minWidth, this.maxWidth)
  }

  static fromJSON(json: BreakpointRangeJSON): BreakpointRange {
    return new this({
      ...json,
      maxWidth: typeof json.maxWidth === 'number' ? json.maxWidth : Infinity,
    })
  }

  toJSON(): BreakpointRangeJSON {
    if (this.maxWidth === Infinity) {
      return {
        minWidth: this.minWidth,
      }
    }

    return {
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
    }
  }
}
