import React from 'react'
import styled, { css } from 'styled-components/macro'
import range from 'lodash/range'
import { rem } from '../../domain/CSSUnit'
import { useStore } from 'effector-react'
import {
  $gridPreferencesMatchedByViewportWidth,
  $displaysGridGuide,
  $highlightsGuide,
} from '../../effector/ui/store'

const highlightMixin = css`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 6px,
      hsla(202, 100%, 45%, 0.25) 8px
    );
    outline: 1px solid hsla(202, 100%, 45%, 0.25);
    pointer-events: none;
  }
`

const StyledGuideContainer = styled.div<{
  maxWidth?: number
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
  max-width: ${({ maxWidth }) =>
    typeof maxWidth === 'number' ? rem(maxWidth) : 'none'};
  height: 100%;
  margin-right: auto;
  margin-left: auto;
  box-shadow: -1px 0 #d1006b, 1px 0 #d1006b;
`

const StyledGuideGrid = styled.div<{
  columns: number
  gutter: number
  margin: number
}>`
  display: grid;
  height: 100%;
  grid-template-columns: ${({ margin, columns, gutter }) =>
    `${rem(margin)} ${range(columns)
      .map((index) => {
        return `${index ? `${rem(gutter)} ` : ''}1fr`
      })
      .join(' ')} ${rem(margin)}`};
`

const StyledGuideMargin = styled.div<{
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
`

const StyledGuideColumn = styled.div<{
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
  background-color: rgba(255, 0, 0, 0.05);
`

const StyledGuideGutter = styled.div<{
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
`

export const Guide = React.memo<{}>(() => {
  const gridPreferences = useStore($gridPreferencesMatchedByViewportWidth)
  const displaysGridGuide = useStore($displaysGridGuide)
  const highlightsGuide = useStore($highlightsGuide)

  if (!gridPreferences) {
    return null
  }

  return (
    <StyledGuideContainer
      maxWidth={gridPreferences.maxWidth}
      highlights={highlightsGuide.maxWidth}
      hidden={!displaysGridGuide}
    >
      <StyledGuideGrid
        columns={gridPreferences.columns}
        gutter={gridPreferences.gutter}
        margin={gridPreferences.margin}
      >
        <StyledGuideMargin highlights={highlightsGuide.margin} />
        {range(gridPreferences.columns).map((index) => {
          return (
            <React.Fragment key={index}>
              {Boolean(index) && (
                <StyledGuideGutter highlights={highlightsGuide.gutter} />
              )}
              <StyledGuideColumn highlights={highlightsGuide.columns} />
            </React.Fragment>
          )
        })}
        <StyledGuideMargin highlights={highlightsGuide.margin} />
      </StyledGuideGrid>
    </StyledGuideContainer>
  )
})
