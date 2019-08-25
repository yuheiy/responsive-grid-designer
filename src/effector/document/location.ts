import { GridSystem, GridSystemJSON } from '../../domain/GridSystem'
import { ulid } from 'ulid'
import isEqual from 'lodash/isEqual'
import { defaultGridSystem } from '../../domain/defaultGridSystem'
import { DemoElement, DemoOffsetPosition } from '../../domain/GridPreferences'

interface GridSystemJSONWithoutId {
  gridPreferencesList: {
    breakpointRange: {
      minWidth: number
      maxWidth?: number
    }
    maxWidth?: number
    columns: number
    gutter: number
    margin: number
    rem: number
    demo: { [key in DemoElement]: { [key in DemoOffsetPosition]: number } }
  }[]
}

const omitId = (gridSystemJSON: GridSystemJSON): GridSystemJSONWithoutId => {
  return {
    ...gridSystemJSON,
    gridPreferencesList: gridSystemJSON.gridPreferencesList.map(
      ({ id, ...withoutId }) => {
        return withoutId
      },
    ),
  }
}

const setId = (
  gridSystemJSONWithoutId: GridSystemJSONWithoutId,
): GridSystemJSON => {
  return {
    ...gridSystemJSONWithoutId,
    gridPreferencesList: gridSystemJSONWithoutId.gridPreferencesList.map(
      (withoutId) => {
        return {
          ...withoutId,
          id: ulid(),
        }
      },
    ),
  }
}

const key = 'gridSystem'

export const parseStateFromURL = () => {
  const rawParam = new URLSearchParams(window.location.search.slice(1)).get(key)

  if (rawParam) {
    const jsonWithoutId = JSON.parse(rawParam)
    return GridSystem.fromJSON(setId(jsonWithoutId))
  }
}

export const saveStateToURL = (gridSystem: GridSystem) => {
  const searchParams = new URLSearchParams(window.location.search.slice(1))
  const jsonWithoutId = omitId(gridSystem.toJSON())

  if (isEqual(jsonWithoutId, omitId(defaultGridSystem))) {
    searchParams.delete(key)
  } else {
    searchParams.set(key, JSON.stringify(jsonWithoutId))
  }

  window.history.replaceState(
    {},
    '',
    String(searchParams) ? `?${searchParams}` : window.location.pathname,
  )
}
