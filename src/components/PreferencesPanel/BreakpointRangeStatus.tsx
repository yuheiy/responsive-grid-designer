import React from 'react'
import styled from 'styled-components/macro'
import { GridPreferences } from '../../domain/GridPreferences'
import { createStoreConsumer } from 'effector-react'
import { $viewportWidth } from '../../effector/ui/store'

export const StyledBreakpointRangeStatus = styled.div`
  display: grid;
  grid-template-areas: '. vw .' 'narrower current wider';
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-end;
  column-gap: 16px;
  row-gap: 8px;
  font-variant-numeric: tabular-nums;
`

const StyledAdjacentRange = styled.span<{ type: 'narrower' | 'wider' }>`
  grid-area: ${({ type }) => type};
  padding-bottom: 4px;
  font-size: 10px;
  line-height: normal;
  color: hsla(0, 0%, 100%, 0.6);
  text-align: ${({ type }) => (type === 'narrower' ? 'right' : 'left')};
`

const StyledViewportWidth = styled.span`
  grid-area: vw;
  width: fit-content;
  margin-right: auto;
  margin-left: auto;
  font-size: 10px;
  line-height: normal;
  color: hsla(0, 0%, 100%, 0.6);
`

const StyledCurrentRange = styled.span`
  grid-area: current;
  width: fit-content;
  margin-right: auto;
  margin-left: auto;
  padding: 4px 12px;
  font-size: 12px;
  line-height: normal;
  font-weight: bold;
  text-align: center;
  background-color: #225671;
  border-radius: 2px;
`

const ViewportWidthConsumer = createStoreConsumer($viewportWidth)

export const BreakpointRangeStatus = React.memo<{
  gridPreferences: GridPreferences
  adjacentNarrowerGridPreferences?: GridPreferences
  adjacentWiderGridPreferences?: GridPreferences
}>(
  ({
    gridPreferences,
    adjacentNarrowerGridPreferences,
    adjacentWiderGridPreferences,
  }) => {
    return (
      <StyledBreakpointRangeStatus>
        <StyledAdjacentRange type="narrower">
          {adjacentNarrowerGridPreferences &&
            adjacentNarrowerGridPreferences.breakpointRange.label}
        </StyledAdjacentRange>
        <StyledViewportWidth>
          [
          <ViewportWidthConsumer>
            {(viewportWidth) => viewportWidth}
          </ViewportWidthConsumer>
          ]
        </StyledViewportWidth>
        <StyledCurrentRange>
          {gridPreferences.breakpointRange.label}
        </StyledCurrentRange>
        <StyledAdjacentRange type="wider">
          {adjacentWiderGridPreferences &&
            adjacentWiderGridPreferences.breakpointRange.label}
        </StyledAdjacentRange>
      </StyledBreakpointRangeStatus>
    )
  },
)
