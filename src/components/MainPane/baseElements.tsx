import React from 'react'
import styled, { css } from 'styled-components/macro'
import { rem } from '../../domain/CSSUnit'
import { lineHeight, useVerticalUnit } from '../../effector/ui/useVerticalUnit'
import { GridPreferences } from '../../domain/GridPreferences'
import { useStore } from 'effector-react'
import { $fontSize, $highlightsGuide } from '../../effector/ui/store'

export const StyledContainer = styled.div<{
  gridPreferences?: GridPreferences
}>`
  max-width: ${({ gridPreferences }) =>
    gridPreferences && typeof gridPreferences.maxWidth === 'number'
      ? rem(gridPreferences.maxWidth)
      : 'none'};
  margin-right: auto;
  margin-left: auto;
  padding-right: ${({ gridPreferences }) =>
    rem(gridPreferences ? gridPreferences.margin : 0)};
  padding-left: ${({ gridPreferences }) =>
    rem(gridPreferences ? gridPreferences.margin : 0)};
`

export const StyledGrid = styled.div<{ gridPreferences?: GridPreferences }>`
  display: grid;
  grid-template-columns: ${({ gridPreferences }) =>
    `repeat(${gridPreferences ? gridPreferences.columns : 1}, 1fr)`};
  column-gap: ${({ gridPreferences }) =>
    rem(gridPreferences ? gridPreferences.gutter : 0)};
`

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
      hsla(202, 100%, 45%, 0.5) 8px
    );
    outline: 1px solid hsla(202, 100%, 45%, 0.5);
    pointer-events: none;
  }
`

const StyledHeading1 = styled.h1<{
  verticalUnit: number
  fontSize: number
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
  margin-top: ${({ verticalUnit }) => rem(verticalUnit * 2)};
  margin-bottom: 0;
  font-family: sans-serif;
  font-size: ${({ fontSize }) => rem(fontSize)};
  line-height: ${({ fontSize }) => rem(fontSize * lineHeight.heading)};
  font-feature-settings: 'palt';
`

const StyledGridHeading1 = styled(StyledHeading1)<{
  gridPreferences?: GridPreferences
}>`
  grid-column-start: ${({ gridPreferences }) =>
    gridPreferences ? gridPreferences.demo.heading1.start : 1};
  grid-column-end: ${({ gridPreferences }) =>
    gridPreferences
      ? Math.min(gridPreferences.demo.heading1.end, gridPreferences.columns + 1)
      : 2};
`

export const GridHeading1 = React.memo<
  React.PropsWithChildren<{
    gridPreferences?: GridPreferences
  }>
>(({ gridPreferences, children }) => {
  const highlightsGuide = useStore($highlightsGuide)
  const fontSize = useStore($fontSize)
  const verticalUnit = useVerticalUnit()

  return (
    <StyledGridHeading1
      gridPreferences={gridPreferences}
      verticalUnit={verticalUnit}
      fontSize={fontSize.heading1}
      highlights={
        highlightsGuide.heading1OffsetPosition ||
        highlightsGuide.heading1FontSize
      }
    >
      {children}
    </StyledGridHeading1>
  )
})

const StyledHeading2 = styled.h2<{
  verticalUnit: number
  fontSize: number
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
  margin-top: ${({ verticalUnit }) => rem(verticalUnit * 2)};
  margin-bottom: 0;
  font-family: sans-serif;
  font-size: ${({ fontSize }) => rem(fontSize)};
  line-height: ${({ fontSize }) => rem(fontSize * lineHeight.heading)};
  font-feature-settings: 'palt';
`

const StyledGridHeading2 = styled(StyledHeading2)<{
  gridPreferences?: GridPreferences
}>`
  grid-column-start: ${({ gridPreferences }) =>
    gridPreferences ? gridPreferences.demo.heading2.start : 1};
  grid-column-end: ${({ gridPreferences }) =>
    gridPreferences
      ? Math.min(gridPreferences.demo.heading2.end, gridPreferences.columns + 1)
      : 2};
`

export const GridHeading2 = React.memo<
  React.PropsWithChildren<{
    gridPreferences?: GridPreferences
  }>
>(({ gridPreferences, children }) => {
  const highlightsGuide = useStore($highlightsGuide)
  const fontSize = useStore($fontSize)
  const verticalUnit = useVerticalUnit()

  return (
    <StyledGridHeading2
      gridPreferences={gridPreferences}
      verticalUnit={verticalUnit}
      fontSize={fontSize.heading2}
      highlights={
        highlightsGuide.heading2OffsetPosition ||
        highlightsGuide.heading2FontSize
      }
    >
      {children}
    </StyledGridHeading2>
  )
})

const StyledHeading3 = styled.h3<{
  verticalUnit: number
}>`
  margin-top: ${({ verticalUnit }) => rem(verticalUnit)};
  margin-bottom: 0;
  font-family: sans-serif;
  font-size: ${rem(16)};
  line-height: ${rem(16 * lineHeight.heading)};
  font-feature-settings: 'palt';
`

export const Heading3 = React.memo<React.PropsWithChildren<{}>>(
  ({ children }) => {
    const verticalUnit = useVerticalUnit()

    return (
      <StyledHeading3 verticalUnit={verticalUnit}>{children}</StyledHeading3>
    )
  },
)

export const StyledParagraph = styled.p<{
  verticalUnit: number
  fontSize: number
  highlights: boolean
}>`
  ${({ highlights }) => highlights && `${highlightMixin}`};
  margin-top: ${({ verticalUnit }) => rem(verticalUnit)};
  margin-bottom: 0;
  font-family: sans-serif;
  font-size: ${({ fontSize }) => rem(fontSize)};
  line-height: ${({ fontSize }) => rem(fontSize * lineHeight.paragraph)};
  font-kerning: none;
`

export const Paragraph = React.memo<React.PropsWithChildren<{}>>(
  ({ children }) => {
    const highlightsGuide = useStore($highlightsGuide)
    const fontSize = useStore($fontSize)
    const verticalUnit = useVerticalUnit()

    return (
      <StyledParagraph
        verticalUnit={verticalUnit}
        fontSize={fontSize.paragraph}
        highlights={highlightsGuide.paragraphFontSize}
      >
        {children}
      </StyledParagraph>
    )
  },
)

const StyledGridParagraph = styled(StyledParagraph)<{
  gridPreferences?: GridPreferences
}>`
  grid-column-start: ${({ gridPreferences }) =>
    gridPreferences ? gridPreferences.demo.paragraph.start : 1};
  grid-column-end: ${({ gridPreferences }) =>
    gridPreferences
      ? Math.min(
          gridPreferences.demo.paragraph.end,
          gridPreferences.columns + 1,
        )
      : 2};
`

export const GridParagraph = React.memo<
  React.PropsWithChildren<{
    gridPreferences?: GridPreferences
  }>
>(({ gridPreferences, children }) => {
  const highlightsGuide = useStore($highlightsGuide)
  const fontSize = useStore($fontSize)
  const verticalUnit = useVerticalUnit()

  return (
    <StyledGridParagraph
      gridPreferences={gridPreferences}
      verticalUnit={verticalUnit}
      fontSize={fontSize.paragraph}
      highlights={
        highlightsGuide.paragraphOffsetPosition ||
        highlightsGuide.paragraphFontSize
      }
    >
      {children}
    </StyledGridParagraph>
  )
})

export const StyledButton = styled.button`
  padding: 0.5rem 0.75rem;
  color: hsla(0, 0%, 0%, 0.87);
  background-color: #eee;
  border: 0;
  border-radius: ${rem(2)};

  &:active {
    background-color: #ccc;
  }
`
