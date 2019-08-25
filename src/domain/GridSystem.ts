import {
  GridPreferences,
  GridPreferencesJSON,
  DemoElement,
  DemoOffsetPosition,
  SketchLayoutSettings,
  FigmaLayoutGrid,
} from './GridPreferences'
import { getSCSSCode } from './getSCSSCode'
import { defaultGridSystem } from './defaultGridSystem'
import { ulid } from 'ulid'

export interface GridSystemProps {
  gridPreferencesList: GridPreferences[]
}

export interface GridSystemJSON {
  gridPreferencesList: GridPreferencesJSON[]
}

export class GridSystem {
  gridPreferencesList: GridPreferences[]

  constructor({ gridPreferencesList }: GridSystemProps) {
    this.gridPreferencesList = gridPreferencesList

    if (this.gridPreferencesList.length) {
      const headGridPreferences: GridPreferences | undefined = this
        .gridPreferencesList[0]

      if (!headGridPreferences) {
        throw new Error('Assertion Error')
      }

      if (!headGridPreferences.breakpointRange.isFromStartingPoint) {
        throw new Error('Assertion Error')
      }

      const lastGridPreferences:
        | GridPreferences
        | undefined = this.gridPreferencesList.slice(-1)[0]

      if (!lastGridPreferences) {
        throw new Error('Assertion Error')
      }

      if (!lastGridPreferences.breakpointRange.isToEndingPoint) {
        throw new Error('Assertion Error')
      }
    }

    this.gridPreferencesList.forEach((gridPreferences, index, array) => {
      const adjacentGridPreferences = array[index + 1]

      if (!adjacentGridPreferences) {
        return
      }

      const isAdjacent =
        gridPreferences.breakpointRange.maxWidth + 1 ===
        adjacentGridPreferences.breakpointRange.minWidth

      if (!isAdjacent) {
        throw new Error('Assertion Error')
      }
    })
  }

  findById(gridPreferencesId: string): GridPreferences | undefined {
    return this.gridPreferencesList.find((gridPreferences) => {
      return gridPreferences.id === gridPreferencesId
    })
  }

  indexOf(gridPreferencesId: string): number {
    return this.gridPreferencesList.findIndex((gridPreferences) => {
      return gridPreferences.id === gridPreferencesId
    })
  }

  getMatched(viewportWidth: number): GridPreferences | undefined {
    return this.gridPreferencesList.find((gridPreferences) => {
      return gridPreferences.breakpointRange.matches(viewportWidth)
    })
  }

  getAdjacentNarrower(gridPreferencesId: string): GridPreferences | undefined {
    const baseIndex = this.gridPreferencesList.findIndex((gridPreferences) => {
      return gridPreferences.id === gridPreferencesId
    })
    return this.gridPreferencesList[baseIndex - 1]
  }

  getAdjacentWider(gridPreferencesId: string): GridPreferences | undefined {
    const baseIndex = this.gridPreferencesList.findIndex((gridPreferences) => {
      return gridPreferences.id === gridPreferencesId
    })
    return this.gridPreferencesList[baseIndex + 1]
  }

  updateBreakpoint(
    gridPreferencesId: string,
    type: 'minWidth' | 'maxWidth',
    value: number,
  ): GridSystem {
    const targetIndex = this.gridPreferencesList.findIndex(
      (gridPreferences) => {
        return gridPreferences.id === gridPreferencesId
      },
    )

    if (targetIndex === -1) {
      throw new Error('')
    }

    const targetGridPreferences = this.gridPreferencesList[targetIndex]
    const adjacentIndex =
      type === 'minWidth' ? targetIndex - 1 : targetIndex + 1
    const adjacentGridPreferences = this.gridPreferencesList[adjacentIndex]

    return new GridSystem({
      ...this,
      gridPreferencesList: this.gridPreferencesList.map((gridPreferences) => {
        if (gridPreferences.id === targetGridPreferences.id) {
          return targetGridPreferences.updateBreakpoint(type, value)
        }

        if (
          adjacentGridPreferences &&
          gridPreferences.id === adjacentGridPreferences.id
        ) {
          return adjacentGridPreferences.updateBreakpoint(
            type === 'minWidth' ? 'maxWidth' : 'minWidth',
            type === 'minWidth' ? value - 1 : value + 1,
          )
        }

        return gridPreferences
      }),
    })
  }

  updatePreference(
    gridPreferencesId: string,
    type: 'maxWidth',
    value?: number,
  ): GridSystem
  updatePreference(
    gridPreferencesId: string,
    type: 'columns' | 'gutter' | 'margin' | 'rem',
    value: number,
  ): GridSystem
  updatePreference(
    gridPreferencesId: string,
    type: any,
    value: any,
  ): GridSystem {
    return new GridSystem({
      ...this,
      gridPreferencesList: this.gridPreferencesList.map((gridPreferences) => {
        if (gridPreferences.id === gridPreferencesId) {
          return gridPreferences.updatePreference(type, value)
        }

        return gridPreferences
      }),
    })
  }

  updateDemoPosition(
    gridPreferencesId: string,
    element: DemoElement,
    offsetPosition: DemoOffsetPosition,
    value: number,
  ): GridSystem {
    return new GridSystem({
      ...this,
      gridPreferencesList: this.gridPreferencesList.map((gridPreferences) => {
        if (gridPreferences.id === gridPreferencesId) {
          return gridPreferences.updateDemoPosition(
            element,
            offsetPosition,
            value,
          )
        }

        return gridPreferences
      }),
    })
  }

  addBreakpoint(): GridSystem {
    if (!this.gridPreferencesList.length) {
      const gridPreferences = GridPreferences.fromJSON(
        defaultGridSystem.gridPreferencesList[0],
      ).updateBreakpoint('maxWidth', Infinity)

      return new GridSystem({
        ...this,
        gridPreferencesList: [gridPreferences],
      })
    }

    const lastGridPreferences = this.gridPreferencesList.slice(-1)[0]
    const updatedLastGridPreferences = lastGridPreferences.updateBreakpoint(
      'maxWidth',
      lastGridPreferences.breakpointRange.minWidth + 240 - 1,
    )
    const addedGridPreferences = GridPreferences.fromJSON({
      ...updatedLastGridPreferences.toJSON(),
      id: ulid(),
      breakpointRange: {
        minWidth: updatedLastGridPreferences.breakpointRange.maxWidth + 1,
        maxWidth: Infinity,
      },
    })

    return new GridSystem({
      ...this,
      gridPreferencesList: [
        ...this.gridPreferencesList.slice(0, -1),
        updatedLastGridPreferences,
        addedGridPreferences,
      ],
    })
  }

  removeBreakpoint(gridPreferencesId: string): GridSystem {
    const targetGridPreferences = this.findById(gridPreferencesId)

    if (!targetGridPreferences) {
      throw new Error('')
    }

    const adjacentNarrowerGridPreferences = this.getAdjacentNarrower(
      targetGridPreferences.id,
    )
    const adjacentWiderGridPreferences = this.getAdjacentWider(
      targetGridPreferences.id,
    )
    const gridPreferencesListWithoutTarget = this.gridPreferencesList.filter(
      (gridPreferences) => {
        return gridPreferences.id !== targetGridPreferences.id
      },
    )

    return new GridSystem({
      ...this,
      gridPreferencesList: (() => {
        if (adjacentWiderGridPreferences) {
          return gridPreferencesListWithoutTarget.map((gridPreferences) => {
            if (gridPreferences.id === adjacentWiderGridPreferences.id) {
              return gridPreferences.updateBreakpoint(
                'minWidth',
                targetGridPreferences.breakpointRange.minWidth,
              )
            }
            return gridPreferences
          })
        }

        if (adjacentNarrowerGridPreferences) {
          return gridPreferencesListWithoutTarget.map((gridPreferences) => {
            if (gridPreferences.id === adjacentNarrowerGridPreferences.id) {
              return gridPreferences.updateBreakpoint(
                'maxWidth',
                targetGridPreferences.breakpointRange.maxWidth,
              )
            }
            return gridPreferences
          })
        }

        return gridPreferencesListWithoutTarget
      })(),
    })
  }

  toSCSSCode(): string {
    return getSCSSCode(this)
  }

  toSketchLayoutSettings(
    artboardWidth: number,
  ): SketchLayoutSettings | undefined {
    const matchedGridPreferences = this.getMatched(artboardWidth)
    if (matchedGridPreferences) {
      return matchedGridPreferences.toSketchLayoutSettings(artboardWidth)
    }
  }

  toFigmaLayoutGrid(artboardWidth: number): FigmaLayoutGrid | undefined {
    const matchedGridPreferences = this.getMatched(artboardWidth)
    if (matchedGridPreferences) {
      return matchedGridPreferences.toFigmaLayoutGrid(artboardWidth)
    }
  }

  static fromJSON(json: GridSystemJSON): GridSystem {
    return new this({
      ...json,
      gridPreferencesList: json.gridPreferencesList.map(
        (gridPreferencesJSON) => {
          return GridPreferences.fromJSON(gridPreferencesJSON)
        },
      ),
    })
  }

  toJSON(): GridSystemJSON {
    const { gridPreferencesList } = this

    return {
      gridPreferencesList: gridPreferencesList.map((gridPreferences) => {
        return gridPreferences.toJSON()
      }),
    }
  }
}
