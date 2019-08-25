import React from 'react'
import { GridSystem } from '../../domain/GridSystem'
import { ulid } from 'ulid'
import { rem } from '../../domain/CSSUnit'
import { Heading3, Paragraph, StyledParagraph } from './baseElements'
import { GridPreferences } from '../../domain/GridPreferences'
import styled from 'styled-components/macro'
import { useArtboardWidthInput } from '../../effector/ui/useInput'
import {
  ARTBOARD_WIDTH_LABEL,
  ARTBOARD_WIDTH_UNIT,
  resizeArtboardWidth,
} from '../../effector/ui/store'

const StyledAssociationList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, auto);
  column-gap: 1rem;
  row-gap: 0.25rem;
  width: fit-content;
  margin-top: 1rem;
  margin-bottom: 0;
  margin-left: 1rem;

  & + ${StyledParagraph} {
    margin-top: 1rem;
  }
`

const StyledAssociationKey = styled.dt`
  text-align: right;
`

const StyledAssociationValue = styled.dd`
  margin-left: 0;
`

const StyledButtonLike = styled.span`
  display: inline-block;
  vertical-align: text-bottom;
  margin-right: 0.25rem;
  padding: 0 0.25rem;
  font-family: system-ui, sans-serif;
  font-size: ${rem(14)};
  line-height: normal;
  border: 1px solid #dddddd;
  border-radius: 0.25rem;
`

const ArtboardWidthInput = React.memo<{}>(() => {
  const inputProps = useArtboardWidthInput()
  return (
    <input
      {...inputProps}
      style={{ marginLeft: '.5rem', borderColor: '#dddddd' }}
      aria-label="アートボードの幅"
    />
  )
})

export const DesignToolsSettings = React.memo<{
  gridSystem: GridSystem
  gridPreferencesMatchedByViewportWidth: GridPreferences
  gridPreferencesMatchedByArtboardWidth: GridPreferences
  preferencesTable: React.ReactNode
  artboardWidth: number
  verticalUnit: number
}>(
  ({
    gridSystem,
    gridPreferencesMatchedByViewportWidth,
    gridPreferencesMatchedByArtboardWidth,
    preferencesTable,
    artboardWidth,
    verticalUnit,
  }) => {
    const id = React.useRef(ulid())
    const dataListId = `${id.current}-datalist`

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: rem(verticalUnit),
          }}
        >
          <span style={{ marginRight: '.5rem' }}>{ARTBOARD_WIDTH_LABEL}:</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <input
              type="range"
              value={artboardWidth}
              min={320}
              max={1920}
              list={dataListId}
              style={{ flexGrow: 1, maxWidth: '32rem', padding: 0, border: 0 }}
              aria-label="アートボードの幅"
              onChange={(event) => {
                resizeArtboardWidth(Number(event.target.value))
              }}
            />
            <datalist id={dataListId}>
              {[320, 375, 768, 1280, 1440].map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
            <ArtboardWidthInput />
            {ARTBOARD_WIDTH_UNIT}
          </span>
        </div>

        <div
          style={{
            overflowX: 'auto',
            marginTop: rem(verticalUnit),
            whiteSpace: 'nowrap',
          }}
        >
          {preferencesTable}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(24rem, 1fr))',
            columnGap: rem(gridPreferencesMatchedByViewportWidth.gutter),
            marginTop: rem(verticalUnit),
          }}
        >
          <div>
            <Heading3>
              <strong>Sketch</strong> Layout Settings
            </Heading3>

            {(() => {
              if (gridPreferencesMatchedByArtboardWidth.rem !== 1) {
                return (
                  <Paragraph>
                    デザインカンプは基準値が100%になる設定で制作してください。
                  </Paragraph>
                )
              }

              const sketchLayoutSettings = gridSystem.toSketchLayoutSettings(
                artboardWidth,
              )

              if (!sketchLayoutSettings) {
                return null
              }

              return (
                <div>
                  <Paragraph>Columns:</Paragraph>

                  <StyledAssociationList>
                    <StyledAssociationKey>Total Width</StyledAssociationKey>
                    <StyledAssociationValue>
                      {sketchLayoutSettings.columns.totalWidth}px
                    </StyledAssociationValue>
                    <StyledAssociationKey>Offset</StyledAssociationKey>
                    <StyledAssociationValue>
                      {sketchLayoutSettings.columns.offset}px
                    </StyledAssociationValue>
                    <StyledAssociationKey>
                      Number of Columns
                    </StyledAssociationKey>
                    <StyledAssociationValue>
                      {sketchLayoutSettings.columns.numberOfColumns}
                    </StyledAssociationValue>
                    <StyledAssociationKey>
                      Gutter on outside
                    </StyledAssociationKey>
                    <StyledAssociationValue>
                      {String(sketchLayoutSettings.columns.gutterOnOutside)}
                    </StyledAssociationValue>
                    <StyledAssociationKey>Gutter Width</StyledAssociationKey>
                    <StyledAssociationValue>
                      {sketchLayoutSettings.columns.gutterWidth}px
                    </StyledAssociationValue>
                    <StyledAssociationKey>Column Width</StyledAssociationKey>
                    <StyledAssociationValue>
                      {sketchLayoutSettings.columns.columnWidth}px
                    </StyledAssociationValue>
                  </StyledAssociationList>

                  <Paragraph>
                    <StyledButtonLike>Center</StyledButtonLike>
                    を押してガイドを中央揃えにしてください。
                  </Paragraph>
                </div>
              )
            })()}
          </div>

          <div>
            <Heading3>
              <strong>Figma</strong> Layout Grid
            </Heading3>

            {(() => {
              if (gridPreferencesMatchedByArtboardWidth.rem !== 1) {
                return (
                  <Paragraph>
                    デザインカンプは基準値が100%になる設定で制作してください。
                  </Paragraph>
                )
              }

              const figmaLayoutGrid = gridSystem.toFigmaLayoutGrid(
                artboardWidth,
              )

              if (!figmaLayoutGrid) {
                return null
              }

              return (
                <div>
                  <Paragraph>Columns:</Paragraph>

                  <StyledAssociationList>
                    <StyledAssociationKey>Count</StyledAssociationKey>
                    <StyledAssociationValue>
                      {figmaLayoutGrid.columns.count}
                    </StyledAssociationValue>
                    <StyledAssociationKey>Type</StyledAssociationKey>
                    <StyledAssociationValue>
                      {figmaLayoutGrid.columns.type}
                    </StyledAssociationValue>
                    <StyledAssociationKey>Width</StyledAssociationKey>
                    <StyledAssociationValue>
                      {typeof figmaLayoutGrid.columns.width === 'number'
                        ? figmaLayoutGrid.columns.width
                        : 'Auto'}
                    </StyledAssociationValue>
                    <StyledAssociationKey>Margin</StyledAssociationKey>
                    <StyledAssociationValue>
                      {figmaLayoutGrid.columns.margin}
                    </StyledAssociationValue>
                    <StyledAssociationKey>Gutter</StyledAssociationKey>
                    <StyledAssociationValue>
                      {figmaLayoutGrid.columns.gutter}
                    </StyledAssociationValue>
                  </StyledAssociationList>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    )
  },
)
