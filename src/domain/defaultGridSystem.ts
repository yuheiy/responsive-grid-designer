import { ulid } from 'ulid'
import { GridSystemJSON } from './GridSystem'

export const defaultGridSystem: GridSystemJSON = {
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
    },
    {
      id: ulid(),
      breakpointRange: {
        minWidth: 720,
        maxWidth: 1023,
      },
      maxWidth: 720,
      columns: 8,
      gutter: 16,
      margin: 16,
      rem: 1,
      demo: {
        heading1: {
          start: 1,
          end: 9,
        },
        heading2: {
          start: 1,
          end: 9,
        },
        paragraph: {
          start: 1,
          end: 8,
        },
      },
    },
    {
      id: ulid(),
      breakpointRange: {
        minWidth: 1024,
        maxWidth: 1279,
      },
      maxWidth: 1024,
      columns: 12,
      gutter: 32,
      margin: 16,
      rem: 1,
      demo: {
        heading1: {
          start: 1,
          end: 13,
        },
        heading2: {
          start: 1,
          end: 13,
        },
        paragraph: {
          start: 1,
          end: 9,
        },
      },
    },
    {
      id: ulid(),
      breakpointRange: {
        minWidth: 1280,
        maxWidth: 1599,
      },
      maxWidth: 1280,
      columns: 12,
      gutter: 32,
      margin: 32,
      rem: 1,
      demo: {
        heading1: {
          start: 1,
          end: 13,
        },
        heading2: {
          start: 1,
          end: 13,
        },
        paragraph: {
          start: 1,
          end: 7,
        },
      },
    },
    {
      id: ulid(),
      breakpointRange: {
        minWidth: 1600,
      },
      maxWidth: 1280,
      columns: 12,
      gutter: 32,
      margin: 32,
      rem: 1.25,
      demo: {
        heading1: {
          start: 1,
          end: 13,
        },
        heading2: {
          start: 1,
          end: 13,
        },
        paragraph: {
          start: 1,
          end: 7,
        },
      },
    },
  ],
}
