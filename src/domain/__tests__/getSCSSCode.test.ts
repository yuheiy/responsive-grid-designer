import { ulid } from 'ulid'
import { GridSystem } from '../GridSystem'
import {
  createVariableDeclaration,
  createMediaQueryVariableDeclaration,
  getMediaQueryVariables,
  getGridVariables,
} from '../getSCSSCode'

const demoJSON = {
  heading1: {
    start: 1,
    end: 2,
  },
  heading2: {
    start: 1,
    end: 2,
  },
  paragraph: {
    start: 1,
    end: 2,
  },
}

describe('getMediaQueryVariables', () => {
  test('with no item', () => {
    expect(
      getMediaQueryVariables(
        GridSystem.fromJSON({
          gridPreferencesList: [],
        }),
      ),
    ).toEqual([])
  })

  test('with single item', () => {
    expect(
      getMediaQueryVariables(
        GridSystem.fromJSON({
          gridPreferencesList: [
            {
              id: ulid(),
              breakpointRange: {
                minWidth: 0,
              },
              columns: 4,
              gutter: 16,
              margin: 16,
              rem: 1,
              demo: demoJSON,
            },
          ],
        }),
      ),
    ).toEqual([])
  })

  test('same preferences items', () => {
    expect(
      getMediaQueryVariables(
        GridSystem.fromJSON({
          gridPreferencesList: [
            {
              id: ulid(),
              breakpointRange: {
                minWidth: 0,
                maxWidth: 719,
              },
              columns: 4,
              gutter: 16,
              margin: 16,
              rem: 1,
              demo: demoJSON,
            },
            {
              id: ulid(),
              breakpointRange: {
                minWidth: 720,
              },
              columns: 4,
              gutter: 16,
              margin: 16,
              rem: 1,
              demo: demoJSON,
            },
          ],
        }),
      ),
    ).toEqual([])
  })

  // https://github.com/facebook/jest/issues/8475
  test('has different preferences', () => {
    expect(
      getMediaQueryVariables(
        GridSystem.fromJSON({
          gridPreferencesList: [
            {
              id: ulid(),
              breakpointRange: {
                minWidth: 0,
                maxWidth: 719,
              },
              columns: 4,
              gutter: 16,
              margin: 16,
              rem: 1,
              demo: demoJSON,
            },
            {
              id: ulid(),
              breakpointRange: {
                minWidth: 720,
              },
              maxWidth: 720,
              columns: 8,
              gutter: 16,
              margin: 16,
              rem: 1,
              demo: demoJSON,
            },
          ],
        }),
      ).map(String),
    ).toEqual([createMediaQueryVariableDeclaration('mq1', 720)].map(String))
  })
})

describe('getGridVariables', () => {
  test('', () => {
    const gridSystem = GridSystem.fromJSON({
      gridPreferencesList: [
        {
          id: ulid(),
          breakpointRange: {
            minWidth: 0,
            maxWidth: 719,
          },
          columns: 4,
          gutter: 16,
          margin: 16,
          rem: 1,
          demo: demoJSON,
        },
        {
          id: ulid(),
          breakpointRange: {
            minWidth: 720,
          },
          maxWidth: 720,
          columns: 8,
          gutter: 16,
          margin: 16,
          rem: 1,
          demo: demoJSON,
        },
      ],
    })
    const mediaQueryVariables = getMediaQueryVariables(gridSystem)
    expect(
      getGridVariables(gridSystem, mediaQueryVariables)
        .toFlattenedArray()
        .map(String),
    ).toEqual(
      [
        createVariableDeclaration('grid-max-width', 'none'),
        createVariableDeclaration('mq1\\:grid-max-width', 'rem(720)'),
        createVariableDeclaration('grid-columns', 4),
        createVariableDeclaration('mq1\\:grid-columns', 8),
        createVariableDeclaration('grid-gutter', 'rem(16)'),
        createVariableDeclaration('grid-margin', 'rem(16)'),
        createVariableDeclaration('root-font-size', 'percentage(1)'),
      ].map(String),
    )
  })
})
