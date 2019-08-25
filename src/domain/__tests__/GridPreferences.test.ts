import { GridPreferences } from '../GridPreferences'
import { ulid } from 'ulid'

describe('GridPreferences', () => {
  test('toSketchLayoutSettings()', () => {
    const commonFields = {
      id: ulid(),
      breakpointRange: {
        minWidth: 0,
        maxWidth: Infinity,
      },
      demo: {
        heading1: {
          start: 1,
          end: 5,
        },
        heading2: {
          start: 1,
          end: 5,
        },
        paragraph: {
          start: 1,
          end: 5,
        },
      },
    }

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toSketchLayoutSettings(320),
    ).toEqual({
      columns: {
        totalWidth: 272,
        offset: 0,
        numberOfColumns: 4,
        gutterOnOutside: false,
        gutterWidth: 16,
        columnWidth: 56,
      },
    })

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        maxWidth: 480,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toSketchLayoutSettings(320),
    ).toEqual({
      columns: {
        totalWidth: 272,
        offset: 0,
        numberOfColumns: 4,
        gutterOnOutside: false,
        gutterWidth: 16,
        columnWidth: 56,
      },
    })

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        maxWidth: 480,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toSketchLayoutSettings(720),
    ).toEqual({
      columns: {
        totalWidth: 432,
        offset: 0,
        numberOfColumns: 4,
        gutterOnOutside: false,
        gutterWidth: 16,
        columnWidth: 96,
      },
    })
  })

  test('toFigmaLayoutGrid()', () => {
    const commonFields = {
      id: ulid(),
      breakpointRange: {
        minWidth: 0,
        maxWidth: Infinity,
      },
      demo: {
        heading1: {
          start: 1,
          end: 5,
        },
        heading2: {
          start: 1,
          end: 5,
        },
        paragraph: {
          start: 1,
          end: 5,
        },
      },
    }

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toFigmaLayoutGrid(320),
    ).toEqual({
      columns: {
        count: 4,
        type: 'Stretch',
        margin: 24,
        gutter: 16,
      },
    })

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        maxWidth: 480,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toFigmaLayoutGrid(320),
    ).toEqual({
      columns: {
        count: 4,
        type: 'Stretch',
        margin: 24,
        gutter: 16,
      },
    })

    expect(
      GridPreferences.fromJSON({
        ...commonFields,
        maxWidth: 480,
        columns: 4,
        gutter: 16,
        margin: 24,
        rem: 1,
      }).toFigmaLayoutGrid(720),
    ).toEqual({
      columns: {
        count: 4,
        type: 'Stretch',
        margin: 144,
        gutter: 16,
      },
    })
  })
})
