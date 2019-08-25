import { createEvent, createStore } from 'effector'
import { GridSystem } from '../../domain/GridSystem'
import { defaultGridSystem } from '../../domain/defaultGridSystem'
import { DemoElement, DemoOffsetPosition } from '../../domain/GridPreferences'
import debounce from 'lodash/debounce'
import after from 'lodash/after'
import { saveStateToURL, parseStateFromURL } from './location'

export const updateBreakpoint = createEvent<{
  gridPreferencesId: string
  type: 'minWidth' | 'maxWidth'
  value: number
}>('updateBreakpoint')

export const updatePreference = createEvent<
  | { gridPreferencesId: string; type: 'maxWidth'; value?: number }
  | {
      gridPreferencesId: string
      type: 'columns' | 'gutter' | 'margin' | 'rem'
      value: number
    }
>('updatePreference')

export const updateDemoPosition = createEvent<{
  gridPreferencesId: string
  element: DemoElement
  offsetPosition: DemoOffsetPosition
  value: number
}>('updateDemoPosition')

export const addBreakpoint = createEvent('addBreakpoint')

export const removeBreakpoint = createEvent<string>('removeBreakpoint')

export const resetGridSystem = createEvent('resetGridSystem')

const getInitialState = () => {
  let fromURL
  try {
    fromURL = parseStateFromURL()
  } catch {}

  return GridSystem.fromJSON(fromURL || defaultGridSystem)
}

export const $gridSystem = createStore<GridSystem>(getInitialState())
  .on(updateBreakpoint, (state, { gridPreferencesId, type, value }) => {
    return state.updateBreakpoint(gridPreferencesId, type, value)
  })
  .on(updatePreference, (state, { gridPreferencesId, type, value }) => {
    if (type === 'maxWidth') {
      return state.updatePreference(gridPreferencesId, type, value)
    }

    if (value === undefined) {
      throw new TypeError('')
    }

    return state.updatePreference(gridPreferencesId, type, value)
  })
  .on(
    updateDemoPosition,
    (state, { gridPreferencesId, element, offsetPosition, value }) => {
      return state.updateDemoPosition(
        gridPreferencesId,
        element,
        offsetPosition,
        value,
      )
    },
  )
  .on(addBreakpoint, (state) => {
    return state.addBreakpoint()
  })
  .on(removeBreakpoint, (state, gridPreferencesId) => {
    return state.removeBreakpoint(gridPreferencesId)
  })
  .on(resetGridSystem, () => {
    return GridSystem.fromJSON(defaultGridSystem)
  })

$gridSystem.watch(
  after(
    2,
    debounce((state) => {
      ;((window as any).requestIdleCallback || window.requestAnimationFrame)(
        () => {
          saveStateToURL(state)
        },
      )
    }, 800),
  ),
)
