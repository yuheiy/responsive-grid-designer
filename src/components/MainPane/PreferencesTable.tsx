import React from 'react'
import styled from 'styled-components/macro'
import { rem } from '../../domain/CSSUnit'
import {
  useGridMaxWidthInput,
  useGridColumnsInput,
  useGridGutterInput,
  useGridMarginInput,
  useGridRemInput,
  useGridBreakpointRange,
} from '../../effector/document/useInput'
import {
  GridPreferences,
  GRID_PREFERENCES_MAX_WIDTH_LABEL,
  GRID_PREFERENCES_MAX_WIDTH_UNIT,
  GRID_PREFERENCES_COLUMNS_LABEL,
  GRID_PREFERENCES_GUTTER_LABEL,
  GRID_PREFERENCES_MARGIN_LABEL,
  GRID_PREFERENCES_GUTTER_UNIT,
  GRID_PREFERENCES_MARGIN_UNIT,
  GRID_PREFERENCES_REM_UNIT,
  GRID_PREFERENCES_REM_LABEL,
} from '../../domain/GridPreferences'
import {
  BREAKPOINT_RANGE_MIN_WIDTH_LABEL,
  BREAKPOINT_RANGE_MAX_WIDTH_LABEL,
  BREAKPOINT_RANGE_LABEL,
} from '../../domain/BreakpointRange'
import { StyledButton } from './baseElements'
import { removeBreakpoint } from '../../effector/document/store'

const StyledPreferencesTable = styled.table`
  color: hsla(0, 0%, 0%, 0.6);
  border-bottom: 1px solid #eee;

  thead {
    border-bottom: 1px solid #eee;
  }

  thead th {
    padding: 0.5rem 1rem;
    font-size: ${rem(14)};
    color: hsla(0, 0%, 0%, 0.6);
  }

  tbody th {
    font-weight: inherit;
  }

  tbody th,
  tbody td {
    padding: 0;
  }

  tbody tr:first-child th,
  tbody tr:first-child td {
    padding-top: 0.75rem;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    padding-bottom: 0.75rem;
  }

  tbody tr[aria-current='true'] {
    color: hsla(0, 0%, 100%, 0.6);
    background-image: linear-gradient(#225671, #225671);
    background-repeat: no-repeat;
  }

  tbody tr[aria-current='true']:first-child {
    /* background-position: left 0.75rem; */
    background-position: left calc(0.75rem + 1px);
  }

  tbody tr[aria-current='true']:last-child {
    background-position: left bottom 0.75rem;
    /* background-position: left bottom calc(0.75rem + 1px); */
  }

  tbody tr[aria-current='true']:first-child:last-child {
    background-position: left center;
    /* background-size: 100% calc(100% - 1.5rem); */
    background-size: 100% calc(100% - 1.5rem - 1px);
  }

  tbody tr[aria-current='true'] > :first-child {
    background-image:
      /* left top */
      url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2">
          <path fill="#FFF" fill-rule="evenodd" d="M0,0 L4,0 L4,4 L0,4 L0,0 Z M2,0 C0.8954305,2.02906125e-16 -1.3527075e-16,0.8954305 0,2 C1.3527075e-16,3.1045695 0.8954305,4 2,4 C3.1045695,4 4,3.1045695 4,2 C4,0.8954305 3.1045695,-2.02906125e-16 2,0 Z"/>
        </svg>
      `)}"),
      /* left bottom */
      url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2">
          <path fill="#FFF" fill-rule="evenodd" d="M4,0 L4,4 L0,4 L0,0 C1.3527075e-16,1.1045695 0.8954305,2 2,2 C3.1045695,2 4,1.1045695 4,0 Z"/>
        </svg>
      `)}");
    background-repeat: no-repeat;
    background-position: left top, left bottom;
    background-size: ${rem(2)} ${rem(2)};
  }

  tbody tr[aria-current='true']:first-child > :first-child {
    background-position: left 0.75rem, left bottom;
  }

  tbody tr[aria-current='true']:last-child > :first-child {
    background-position: left top, left bottom 0.75rem;
  }

  tbody tr[aria-current='true']:first-child:last-child > :first-child {
    background-position: left 0.75rem, left bottom 0.75rem;
  }

  tbody tr[aria-current='true'] > :last-child {
    background-image:
      /* right top */
      url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2">
          <path fill="#FFF" fill-rule="evenodd" d="M0,4 C1.1045695,4 2,3.1045695 2,2 C2,0.8954305 1.1045695,-2.02906125e-16 0,0 L4,0 L4,4 L0,4 Z"/>
        </svg>
      `)}"),
      /* right bottom */
      url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2">
          <path fill="#FFF" fill-rule="evenodd" d="M2,0 L4,0 L4,4 L0,4 L0,2 C1.1045695,2 2,1.1045695 2,0 Z"/>
        </svg>
      `)}");
    background-repeat: no-repeat;
    background-position: right top, right bottom;
    background-size: ${rem(2)} ${rem(2)};
  }

  tbody tr[aria-current='true']:first-child > :last-child {
    background-position: right 0.75rem, right bottom;
  }

  tbody tr[aria-current='true']:last-child > :last-child {
    background-position: right top, right bottom 0.75rem;
  }

  tbody tr[aria-current='true']:first-child:last-child > :last-child {
    background-position: right 0.75rem, right bottom 0.75rem;
  }
`

const StyledPreferencesTableBodyCellInner = styled.div<{
  group?: 'start' | 'between' | 'end'
}>`
  position: relative;
  padding: 0.75rem 1rem;

  ${({ group }) =>
    group &&
    `&::before {
        content: '';
        position: absolute;
        right: 0.5rem;
        left: 0.5rem;
        ${
          group === 'start'
            ? `
              top: 0.25rem;
              bottom: 0;
              border-width: 1px 1px 0;
            `
            : ''
        }
        ${
          group === 'between'
            ? `
              top: 0;
              bottom: 0;
              border-width: 0 1px;
            `
            : ''
        }
        ${
          group === 'end'
            ? `
              top: 0;
              bottom: 0.25rem;
              border-width: 0 1px 1px;
            `
            : ''
        }
        border-style: solid;
        border-color: #ddd;
        background-color: hsla(0, 0%, 0%, 0.01);
        border-radius: ${rem(2)};
        pointer-events: none;
      }`}
`

const StyledControl = styled.label`
  display: flex;
  align-items: center;
`

const StyledControlInput = styled.span`
  position: relative;
  display: inline-block;
`

const StyledNumberInput = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: hsla(0, 0%, 0%, 0.87);
  background-color: #fff;
  border-color: #eee;
  border-radius: ${rem(2)};
`

const StyledControlInputOverlay = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 1px;
  padding: 0.5rem 0.75rem;
  color: hsla(0, 0%, 0%, 0.87);
  pointer-events: none;
`

const StyledControlUnit = styled.span`
  margin-left: 0.5rem;
  font-size: ${rem(14)};
`

type GridInputProps = { gridPreferencesId: string }

const [GridBreakpointRangeMinField, GridBreakpointRangeMaxField] = ([
  ['minWidth', BREAKPOINT_RANGE_MIN_WIDTH_LABEL],
  ['maxWidth', BREAKPOINT_RANGE_MAX_WIDTH_LABEL],
] as const).map(([type, label]) => {
  return React.memo<GridInputProps>(({ gridPreferencesId }) => {
    const inputProps = useGridBreakpointRange(gridPreferencesId, type)

    return (
      <StyledControl>
        <StyledControlInput>
          <StyledNumberInput {...inputProps} aria-label={label} />
        </StyledControlInput>
      </StyledControl>
    )
  })
})

const GridMaxWidthField = React.memo<GridInputProps>(
  ({ gridPreferencesId }) => {
    const [inputProps, shouldDisplayNone] = useGridMaxWidthInput(
      gridPreferencesId,
    )

    return (
      <StyledControl>
        <StyledControlInput>
          <StyledNumberInput
            {...inputProps}
            aria-label={GRID_PREFERENCES_MAX_WIDTH_LABEL}
          />
          <StyledControlInputOverlay hidden={!shouldDisplayNone}>
            none
          </StyledControlInputOverlay>
        </StyledControlInput>
        <StyledControlUnit hidden={shouldDisplayNone}>
          {GRID_PREFERENCES_MAX_WIDTH_UNIT}
        </StyledControlUnit>
      </StyledControl>
    )
  },
)

const [GridColumnsField, GridGutterField, GridMarginField] = ([
  [useGridColumnsInput, GRID_PREFERENCES_COLUMNS_LABEL],
  [
    useGridGutterInput,
    GRID_PREFERENCES_GUTTER_LABEL,
    GRID_PREFERENCES_GUTTER_UNIT,
  ],
  [
    useGridMarginInput,
    GRID_PREFERENCES_MARGIN_LABEL,
    GRID_PREFERENCES_MARGIN_UNIT,
  ],
] as const).map(([useGridInput, label, unit]) => {
  return React.memo<GridInputProps>(({ gridPreferencesId }) => {
    const inputProps = useGridInput(gridPreferencesId)

    return (
      <StyledControl>
        <StyledControlInput>
          <StyledNumberInput {...inputProps} aria-label={label} />
        </StyledControlInput>
        {unit && <StyledControlUnit>{unit}</StyledControlUnit>}
      </StyledControl>
    )
  })
})

const GridRemField = React.memo<GridInputProps>(({ gridPreferencesId }) => {
  const inputProps = useGridRemInput(gridPreferencesId)

  return (
    <StyledControl>
      <StyledControlInput>
        <StyledNumberInput
          {...inputProps}
          aria-label={GRID_PREFERENCES_REM_LABEL}
        />
      </StyledControlInput>
      <StyledControlUnit>{GRID_PREFERENCES_REM_UNIT}</StyledControlUnit>
    </StyledControl>
  )
})

const getGroupType = (
  propertyName: 'maxWidth' | 'columns' | 'gutter' | 'margin' | 'rem',
  current: GridPreferences,
  prev?: GridPreferences,
  next?: GridPreferences,
): 'start' | 'between' | 'end' | undefined => {
  const isSameAsPrev = prev
    ? current[propertyName] === prev[propertyName]
    : false
  const isSameAsNext = next
    ? current[propertyName] === next[propertyName]
    : false

  if (isSameAsPrev && isSameAsNext) {
    return 'between'
  }

  if (isSameAsPrev) {
    return 'end'
  }

  if (isSameAsNext) {
    return 'start'
  }
}

export const PreferencesTable = React.memo<{
  gridPreferencesList: GridPreferences[]
  gridPreferencesMatchedByViewportWidth: GridPreferences
}>(({ gridPreferencesList, gridPreferencesMatchedByViewportWidth }) => {
  return (
    <StyledPreferencesTable>
      <thead>
        <tr>
          <th scope="col">{BREAKPOINT_RANGE_LABEL}</th>
          <th scope="col">{GRID_PREFERENCES_MAX_WIDTH_LABEL}</th>
          <th scope="col">{GRID_PREFERENCES_COLUMNS_LABEL}</th>
          <th scope="col">{GRID_PREFERENCES_GUTTER_LABEL}</th>
          <th scope="col">{GRID_PREFERENCES_MARGIN_LABEL}</th>
          <th scope="col">{GRID_PREFERENCES_REM_LABEL}</th>
          <th scope="col">削除</th>
        </tr>
      </thead>
      <tbody>
        {gridPreferencesList.map((gridPreferences, index, array) => {
          const prevItem: GridPreferences | undefined = array[index - 1]
          const nextItem: GridPreferences | undefined = array[index + 1]

          return (
            <tr
              key={gridPreferences.id}
              aria-current={
                gridPreferences.id === gridPreferencesMatchedByViewportWidth.id
                  ? 'true'
                  : undefined
              }
            >
              <th
                scope="row"
                aria-label={gridPreferences.breakpointRange.label}
              >
                <StyledPreferencesTableBodyCellInner>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      columnGap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      <GridBreakpointRangeMinField
                        gridPreferencesId={gridPreferences.id}
                      />
                    </span>
                    <span>{gridPreferences.breakpointRange.rangeSymbol}</span>
                    <span>
                      {!gridPreferences.breakpointRange.isToEndingPoint && (
                        <GridBreakpointRangeMaxField
                          gridPreferencesId={gridPreferences.id}
                        />
                      )}
                    </span>
                  </div>
                </StyledPreferencesTableBodyCellInner>
              </th>
              <td>
                <StyledPreferencesTableBodyCellInner
                  group={getGroupType(
                    'maxWidth',
                    gridPreferences,
                    prevItem,
                    nextItem,
                  )}
                >
                  <GridMaxWidthField gridPreferencesId={gridPreferences.id} />
                </StyledPreferencesTableBodyCellInner>
              </td>
              <td>
                <StyledPreferencesTableBodyCellInner
                  group={getGroupType(
                    'columns',
                    gridPreferences,
                    prevItem,
                    nextItem,
                  )}
                >
                  <GridColumnsField gridPreferencesId={gridPreferences.id} />
                </StyledPreferencesTableBodyCellInner>
              </td>
              <td>
                <StyledPreferencesTableBodyCellInner
                  group={getGroupType(
                    'gutter',
                    gridPreferences,
                    prevItem,
                    nextItem,
                  )}
                >
                  <GridGutterField gridPreferencesId={gridPreferences.id} />
                </StyledPreferencesTableBodyCellInner>
              </td>
              <td>
                <StyledPreferencesTableBodyCellInner
                  group={getGroupType(
                    'margin',
                    gridPreferences,
                    prevItem,
                    nextItem,
                  )}
                >
                  <GridMarginField gridPreferencesId={gridPreferences.id} />
                </StyledPreferencesTableBodyCellInner>
              </td>
              <td>
                <StyledPreferencesTableBodyCellInner
                  group={getGroupType(
                    'rem',
                    gridPreferences,
                    prevItem,
                    nextItem,
                  )}
                >
                  <GridRemField gridPreferencesId={gridPreferences.id} />
                </StyledPreferencesTableBodyCellInner>
              </td>
              <td>
                <StyledPreferencesTableBodyCellInner>
                  <StyledButton
                    type="button"
                    onClick={() => {
                      removeBreakpoint(gridPreferences.id)
                    }}
                  >
                    削除
                  </StyledButton>
                </StyledPreferencesTableBodyCellInner>
              </td>
            </tr>
          )
        })}
      </tbody>
    </StyledPreferencesTable>
  )
})
