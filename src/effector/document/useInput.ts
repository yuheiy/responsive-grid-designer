import React from 'react'
import {
  useRequiredNumberInputWithNormalization,
  useOptionalNumberInputWithNormalization,
} from '../../hooks/useNumberInput'
import {
  DemoElement,
  MAX_WIDTH_MIN,
  MAX_WIDTH_MAX,
  COLUMNS_MIN,
  COLUMNS_MAX,
  GUTTER_MIN,
  GUTTER_MAX,
  MARGIN_MIN,
  MARGIN_MAX,
  DemoOffsetPosition,
} from '../../domain/GridPreferences'
import {
  VIEWPORT_WIDTH_MAX,
  VIEWPORT_WIDTH_MIN,
} from '../../domain/BreakpointRange'
import { useStore } from 'effector-react'
import {
  $gridPreferencesMatchedByViewportWidth,
  highlightGuide,
  unhighlightGuide,
} from '../ui/store'
import {
  $gridSystem,
  updateBreakpoint,
  updatePreference,
  updateDemoPosition,
} from './store'

export const useGridBreakpointRange = (
  gridPreferencesId: string,
  type: 'minWidth' | 'maxWidth',
) => {
  const gridSystem = useStore($gridSystem)
  const targetGridPreferences = gridSystem.findById(gridPreferencesId)

  if (!targetGridPreferences) {
    throw new Error('')
  }

  const adjacentPreferences =
    type === 'minWidth'
      ? gridSystem.getAdjacentNarrower(targetGridPreferences.id)
      : gridSystem.getAdjacentWider(targetGridPreferences.id)

  const min = (() => {
    if (type === 'minWidth') {
      return adjacentPreferences
        ? adjacentPreferences.breakpointRange.minWidth + 2
        : VIEWPORT_WIDTH_MIN
    }

    return targetGridPreferences.breakpointRange.minWidth + 1
  })()
  const max = (() => {
    if (type === 'minWidth') {
      return targetGridPreferences.breakpointRange.isToEndingPoint
        ? VIEWPORT_WIDTH_MAX
        : targetGridPreferences.breakpointRange.maxWidth - 1
    }

    return adjacentPreferences &&
      !adjacentPreferences.breakpointRange.isToEndingPoint
      ? adjacentPreferences.breakpointRange.maxWidth - 2
      : VIEWPORT_WIDTH_MAX
  })()

  const baseInputProps = useRequiredNumberInputWithNormalization({
    value: targetGridPreferences.breakpointRange[type],
    max,
    min,
    changeValue: (value) => {
      updateBreakpoint({ gridPreferencesId, type, value })
    },
  })
  const readOnly =
    type === 'minWidth' &&
    targetGridPreferences.breakpointRange.isFromStartingPoint
  const inputProps = {
    ...baseInputProps,
    readOnly,
  }
  return inputProps
}

export const useGridMaxWidthInput = (gridPreferencesId: string) => {
  const gridSystem = useStore($gridSystem)
  const targetGridPreferences = gridSystem.findById(gridPreferencesId)
  const gridPreferencesMatchedByViewportWidth = useStore(
    $gridPreferencesMatchedByViewportWidth,
  )

  if (!targetGridPreferences) {
    throw new Error('')
  }

  if (!gridPreferencesMatchedByViewportWidth) {
    throw new Error('')
  }

  const propertyName = 'maxWidth'
  const [isFocused, setIsFocused] = React.useState(false)
  const baseInputProps = useOptionalNumberInputWithNormalization({
    value: targetGridPreferences[propertyName],
    min: MAX_WIDTH_MIN,
    max: MAX_WIDTH_MAX,
    changeValue: (value) => {
      updatePreference({
        gridPreferencesId,
        type: propertyName,
        value,
      })
    },
    onFocus: () => {
      setIsFocused(true)

      highlightGuide({
        gridPreferencesId,
        guide: propertyName,
      })
    },
    onBlur: () => {
      setIsFocused(false)
      unhighlightGuide()
    },
  })
  const inputProps = {
    ...baseInputProps,
    placeholder: isFocused
      ? String(
          targetGridPreferences.breakpointRange.isToEndingPoint
            ? 1920
            : targetGridPreferences.breakpointRange.maxWidth,
        )
      : undefined,
    step: 4,
  }
  const noMaxWidth = targetGridPreferences[propertyName] === undefined
  const shouldDisplayNone = noMaxWidth && !isFocused

  return [inputProps, shouldDisplayNone] as const
}

export const [useGridColumnsInput, useGridGutterInput, useGridMarginInput] = ([
  [
    'columns',
    {
      max: COLUMNS_MAX,
      min: COLUMNS_MIN,
      step: 1,
    },
  ],
  [
    'gutter',
    {
      max: GUTTER_MAX,
      min: GUTTER_MIN,
      step: 4,
    },
  ],
  [
    'margin',
    {
      max: MARGIN_MAX,
      min: MARGIN_MIN,
      step: 4,
    },
  ],
] as const).map(([propertyName, { max, min, step }]) => {
  return (gridPreferencesId: string) => {
    const gridSystem = useStore($gridSystem)
    const targetGridPreferences = gridSystem.findById(gridPreferencesId)
    const gridPreferencesMatchedByViewportWidth = useStore(
      $gridPreferencesMatchedByViewportWidth,
    )

    if (!targetGridPreferences) {
      throw new Error('')
    }

    if (!gridPreferencesMatchedByViewportWidth) {
      throw new Error('')
    }

    const baseInputProps = useRequiredNumberInputWithNormalization({
      value: targetGridPreferences[propertyName],
      max,
      min,
      changeValue: (value) => {
        updatePreference({
          gridPreferencesId,
          type: propertyName,
          value,
        })
      },
      onFocus: () => {
        highlightGuide({
          gridPreferencesId,
          guide: propertyName,
        })
      },
      onBlur: () => {
        unhighlightGuide()
      },
    })
    const inputProps = {
      ...baseInputProps,
      step,
    }
    return inputProps
  }
})

export const useGridRemInput = (gridPreferencesId: string) => {
  const gridSystem = useStore($gridSystem)
  const targetGridPreferences = gridSystem.findById(gridPreferencesId)

  if (!targetGridPreferences) {
    throw new Error('')
  }

  const propertyName = 'rem'
  const baseInputProps = useRequiredNumberInputWithNormalization({
    value: Number((targetGridPreferences[propertyName] * 100).toFixed(1)),
    min: 100,
    max: 200,
    changeValue: (value) => {
      updatePreference({
        gridPreferencesId,
        type: propertyName,
        value: value / 100,
      })
    },
  })
  const inputProps = {
    ...baseInputProps,
    step: 0.5,
  }
  return inputProps
}

export const useDemoPositionInput = (
  gridPreferencesId: string,
  element: DemoElement,
  offsetPosition: DemoOffsetPosition,
) => {
  const gridSystem = useStore($gridSystem)
  const targetGridPreferences = gridSystem.findById(gridPreferencesId)
  const gridPreferencesMatchedByViewportWidth = useStore(
    $gridPreferencesMatchedByViewportWidth,
  )

  if (!targetGridPreferences) {
    throw new Error('')
  }

  if (!gridPreferencesMatchedByViewportWidth) {
    throw new Error('')
  }

  const targetElement = targetGridPreferences.demo[element]
  const inputProps = useRequiredNumberInputWithNormalization({
    value: Math.min(
      targetElement[offsetPosition],
      targetGridPreferences.columns + 1,
    ),
    min: offsetPosition === 'start' ? 1 : targetElement.start + 1,
    max:
      offsetPosition === 'start'
        ? targetElement.end - 1
        : targetGridPreferences.columns + 1,
    changeValue: (value) => {
      updateDemoPosition({
        gridPreferencesId,
        element,
        offsetPosition,
        value,
      })
    },
    onFocus: () => {
      highlightGuide({
        guide: `${element}:offsetPosition` as
          | 'heading1:offsetPosition'
          | 'heading2:offsetPosition'
          | 'paragraph:offsetPosition',
      })
    },
    onBlur: () => {
      unhighlightGuide()
    },
  })
  return inputProps
}
