import React from 'react'
import styled from 'styled-components/macro'
import { pointer } from 'popmotion'
import { PointerProps } from 'popmotion/lib/input/pointer/types'
import { updateBreakpoint, $gridSystem } from '../../effector/document/store'
import { GridSystem } from '../../domain/GridSystem'
import { $gridPreferencesMatchedByViewportWidth } from '../../effector/ui/store'
import { useStore } from 'effector-react'

const StyledBreakpointSlider = styled.div`
  font-size: 14px;
  line-height: 24px;
  color: hsla(0, 0%, 100%, 0.87);
  background-color: hsl(206, 7%, 21%);
  cursor: default;
`

const StyledRail = styled.div`
  display: flex;
  overflow: hidden;
  text-align: center;
`

const StyledRange = styled.div`
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  &[aria-current='true'] {
    font-weight: bold;
    background-color: #225671;
  }
`

const StyledRangeInner = styled.div`
  padding-right: 12px;
  padding-left: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledThumb = styled.div`
  position: relative;
  cursor: ew-resize;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -12px;
    bottom: 0;
    left: -12px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1px;
    right: -4px;
    bottom: 1px;
    left: -4px;
    background-color: #eee;
    border-radius: 99em;
  }

  &:active::after {
    background-color: #ccc;
  }
`

const useSlider = (gridSystem: GridSystem) => {
  const pointerTracker = React.useRef<any>()

  React.useEffect(() => {
    const stopMoving = () => {
      if (pointerTracker.current) {
        pointerTracker.current.stop()
        pointerTracker.current = null
      }
    }

    document.addEventListener('mouseup', stopMoving)
    return () => document.removeEventListener('mouseup', stopMoving)
  }, [])

  const getSliderProps = (
    gridPreferencesId: string,
  ): React.HTMLAttributes<HTMLDivElement> => {
    const targetGridPreferences = gridSystem.findById(gridPreferencesId)
    const adjacentNarrowerGridPreferences = gridSystem.getAdjacentNarrower(
      gridPreferencesId,
    )
    const targetIndex = gridSystem.indexOf(gridPreferencesId)

    if (!targetGridPreferences) {
      throw new Error('')
    }

    if (!adjacentNarrowerGridPreferences) {
      throw new Error('')
    }

    const now = targetGridPreferences.breakpointRange.minWidth
    const max = targetGridPreferences.breakpointRange.maxWidth - 1
    const min = adjacentNarrowerGridPreferences.breakpointRange.minWidth + 2

    const updateWithNormalization = (value: number) => {
      const normalizedValue = Math.max(min, Math.min(value, max))

      if (normalizedValue !== now) {
        updateBreakpoint({
          gridPreferencesId,
          type: 'minWidth',
          value: normalizedValue,
        })
      }
    }

    const startMoving = () => {
      pointerTracker.current = pointer({
        x: now,
      }).start(({ x }: PointerProps) => {
        if (typeof x !== 'number') {
          return
        }

        updateWithNormalization(x)
      })
    }

    return {
      tabIndex: 0,
      role: 'slider',
      'aria-valuemax': max,
      'aria-valuemin': min,
      'aria-valuenow': now,
      'aria-valuetext': `${now}px`,
      'aria-label': `${targetIndex}つ目のブレイクポイント`,
      onMouseDown: (event) => {
        if (event.button === 0) {
          startMoving()
          event.preventDefault()
        }
      },
      onTouchStart: () => {
        // todo
      },
      onKeyDown: (event) => {
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowUp': {
            updateWithNormalization(now + 1)
            break
          }

          case 'ArrowLeft':
          case 'ArrowDown': {
            updateWithNormalization(now - 1)
            break
          }

          case 'PageUp': {
            updateWithNormalization(now + 10)
            break
          }

          case 'PageDown': {
            updateWithNormalization(now - 10)
            break
          }

          case 'Home': {
            updateWithNormalization(min)
            break
          }

          case 'End': {
            updateWithNormalization(max)
            break
          }

          default: {
            return
          }
        }

        event.preventDefault()
      },
    }
  }

  return getSliderProps
}

export const BreakpointSlider = React.memo<{}>(() => {
  const gridSystem = useStore($gridSystem)
  const gridPreferencesMatchedByViewportWidth = useStore(
    $gridPreferencesMatchedByViewportWidth,
  )
  const getSliderProps = useSlider(gridSystem)

  let innerNode = null
  if (
    gridSystem.gridPreferencesList.length &&
    gridPreferencesMatchedByViewportWidth
  ) {
    innerNode = gridSystem.gridPreferencesList.map((gridPreferences) => {
      return (
        <React.Fragment key={gridPreferences.id}>
          {!gridPreferences.breakpointRange.isFromStartingPoint && (
            <StyledThumb {...getSliderProps(gridPreferences.id)} />
          )}

          <StyledRange
            title={gridPreferences.breakpointRange.label}
            aria-current={
              gridPreferencesMatchedByViewportWidth.id === gridPreferences.id
                ? 'true'
                : undefined
            }
            style={
              gridPreferences.breakpointRange.isToEndingPoint
                ? {
                    minWidth: 128,
                    flexGrow: 1,
                  }
                : {
                    width:
                      gridPreferences.breakpointRange.maxWidth -
                      gridPreferences.breakpointRange.minWidth,
                  }
            }
          >
            <StyledRangeInner>
              {gridPreferences.breakpointRange.label}
            </StyledRangeInner>
          </StyledRange>
        </React.Fragment>
      )
    })
  } else {
    const label = 'N/A'
    innerNode = (
      <StyledRange
        title={label}
        style={{
          flexGrow: 1,
        }}
      >
        <StyledRangeInner>{label}</StyledRangeInner>
      </StyledRange>
    )
  }

  return (
    <StyledBreakpointSlider role="group" aria-label="ブレイクポイント">
      <StyledRail>{innerNode}</StyledRail>
    </StyledBreakpointSlider>
  )
})
