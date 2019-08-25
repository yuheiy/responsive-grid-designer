import React from 'react'
import styled from 'styled-components/macro'
import range from 'lodash/range'
import { GridPreferences } from '../../domain/GridPreferences'
import { rem } from '../../domain/CSSUnit'
import { PreferencesTable } from './PreferencesTable'
import { SourceCode } from './SourceCode'
import { DesignToolsSettings } from './DesignToolsSettings'
import {
  StyledContainer,
  StyledGrid,
  GridHeading1,
  GridHeading2,
  GridParagraph,
  StyledButton,
  Paragraph,
} from './baseElements'
import {
  addBreakpoint,
  resetGridSystem,
  $gridSystem,
} from '../../effector/document/store'
import { useStore } from 'effector-react'
import {
  $gridPreferencesMatchedByViewportWidth,
  $gridPreferencesMatchedByArtboardWidth,
  $artboardWidth,
  resetFontSize,
} from '../../effector/ui/store'
import { useVerticalUnit } from '../../effector/ui/useVerticalUnit'
const { importMDX } = require('mdx.macro')

const Readme = React.lazy(() => importMDX('./readme.mdx'))

const getRows = (columns: number): number[][] => {
  if (columns === 12) {
    return [[6, 6], [4, 4, 4], [3, 3, 3, 3]]
  }
  if (columns === 11) {
    return [[6, 5], [4, 3, 4], [3, 3, 2, 3]]
  }
  if (columns === 10) {
    return [[5, 5], [3, 4, 3], [2, 3, 2, 3]]
  }
  if (columns === 9) {
    return [[4, 5], [3, 3, 3], [2, 3, 2, 2]]
  }
  if (columns === 8) {
    return [[4, 4], [3, 2, 3], [2, 2, 2, 2]]
  }
  if (columns === 7) {
    return [[3, 4], [2, 3, 2]]
  }
  if (columns === 6) {
    return [[3, 3], [2, 2, 2]]
  }
  if (columns === 5) {
    return [[3, 2], [2, 3]]
  }
  if (columns === 4) {
    return [[2, 2], [1, 3]]
  }
  if (columns === 3) {
    return [[2, 1], [1, 1, 1]]
  }
  if (columns === 2) {
    return [[2], [1, 1]]
  }
  if (columns === 1) {
    return [[1], [1]]
  }

  return []
}

const StyledSectionDisclosureSummary = styled.button`
  display: flex;
  width: 100%;
  padding: 0;
  text-align: inherit;
  border: 0;

  &::before {
    flex-shrink: 0;
    width: 1em;
    margin-right: 1em;
    font-size: 0.5em;
    color: hsla(0, 0%, 0%, 0.6);
  }

  &[aria-expanded='true']::before {
    content: '▼';
  }

  &[aria-expanded='false']::before {
    content: '▶';
  }
`

const SectionDisclosure = React.memo<
  React.PropsWithChildren<{
    gridPreferences?: GridPreferences
    summaryNode: React.ReactNode
    children: React.ReactNode
  }>
>(({ gridPreferences, summaryNode, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <StyledGrid
      gridPreferences={gridPreferences}
      role="group"
      style={{ gridColumn: '1 / -1' }}
    >
      <GridHeading2 gridPreferences={gridPreferences}>
        <StyledSectionDisclosureSummary
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            setIsExpanded((condition) => !condition)
          }}
        >
          {summaryNode}
        </StyledSectionDisclosureSummary>
      </GridHeading2>

      <div hidden={!isExpanded} style={{ gridColumn: '1 / -1' }}>
        {children}
      </div>
    </StyledGrid>
  )
})

export const MainPane = React.memo<{}>(() => {
  const gridSystem = useStore($gridSystem)
  const gridPreferencesMatchedByViewportWidth = useStore(
    $gridPreferencesMatchedByViewportWidth,
  )
  const gridPreferencesMatchedByArtboardWidth = useStore(
    $gridPreferencesMatchedByArtboardWidth,
  )
  const artboardWidth = useStore($artboardWidth)
  const verticalUnit = useVerticalUnit()

  return (
    <StyledContainer
      as="main"
      gridPreferences={gridPreferencesMatchedByViewportWidth}
    >
      <StyledGrid gridPreferences={gridPreferencesMatchedByViewportWidth}>
        <GridHeading1 gridPreferences={gridPreferencesMatchedByViewportWidth}>
          {['レスポンシブ', 'グリッド', 'デザイナー'].map((chunk, index) => {
            return (
              <span key={index} style={{ display: 'inline-block' }}>
                {chunk}
              </span>
            )
          })}
        </GridHeading1>

        <GridParagraph gridPreferences={gridPreferencesMatchedByViewportWidth}>
          レスポンシブデザインを前提にしたグリッドシステムのシミュレーションができるツールです。このページを開いている
          <strong>ウィンドウの幅をリサイズ</strong>
          すると、それに反応してページ全体のレイアウトが変化します。
        </GridParagraph>

        <GridHeading2 gridPreferences={gridPreferencesMatchedByViewportWidth}>
          デモ
        </GridHeading2>

        <div
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            rowGap: rem(verticalUnit),
            marginTop: rem(verticalUnit),
          }}
        >
          {getRows(
            gridPreferencesMatchedByViewportWidth
              ? gridPreferencesMatchedByViewportWidth.columns
              : 1,
          ).map((row, rowIndex) => {
            return (
              <StyledGrid
                key={rowIndex}
                gridPreferences={gridPreferencesMatchedByViewportWidth}
              >
                {row.map((col, colIndex) => {
                  const start =
                    row.slice(0, colIndex).reduce((acc, n) => acc + n, 0) + 1
                  const end = start + col
                  return (
                    <div
                      key={colIndex}
                      style={{
                        gridColumn: `${start} / ${end}`,
                        paddingTop: `${(9 / 16) * 100}%`,
                        backgroundImage: `url("https://source.unsplash.com/random/800x450")`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                      }}
                    />
                  )
                })}
              </StyledGrid>
            )
          })}
        </div>

        <div
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            marginTop: rem(verticalUnit),
          }}
        >
          {getRows(
            gridPreferencesMatchedByViewportWidth
              ? gridPreferencesMatchedByViewportWidth.columns
              : 1,
          ).map((row, rowIndex) => {
            return (
              <StyledGrid
                key={rowIndex}
                gridPreferences={gridPreferencesMatchedByViewportWidth}
              >
                {row.map((col, colIndex) => {
                  const start =
                    row.slice(0, colIndex).reduce((acc, n) => acc + n, 0) + 1
                  const end = start + col
                  return (
                    <div
                      key={colIndex}
                      style={{
                        gridColumn: `${start} / ${end}`,
                      }}
                    >
                      <Paragraph>
                        「ではみなさんは、そういうふうに川だと云いわれたり、乳の流れたあとだと云われたりしていたこのぼんやりと白いものがほんとうは何かご承知ですか。」先生は、黒板に吊つるした大きな黒い星座の図の、上から下へ白くけぶった銀河帯のようなところを指さしながら、みんなに問といをかけました。
                      </Paragraph>
                    </div>
                  )
                })}
              </StyledGrid>
            )
          })}
        </div>

        <div
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            rowGap: '.5rem',
            marginTop: rem(verticalUnit * 2),
          }}
        >
          {range(
            gridPreferencesMatchedByViewportWidth
              ? gridPreferencesMatchedByViewportWidth.columns
              : 1,
          ).map((rowIndex) => {
            return (
              <StyledGrid
                key={rowIndex}
                gridPreferences={gridPreferencesMatchedByViewportWidth}
              >
                <div
                  style={{
                    gridColumn: `1 / ${rowIndex + 2}`,
                    lineHeight: '2.5rem',
                    textAlign: 'center',
                    backgroundColor: '#ccc',
                  }}
                >
                  {rowIndex + 1}
                </div>
                {range(
                  (gridPreferencesMatchedByViewportWidth
                    ? gridPreferencesMatchedByViewportWidth.columns
                    : 1) -
                    rowIndex -
                    1,
                ).map((colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      style={{
                        gridColumn: `${rowIndex + 2 + colIndex} / ${rowIndex +
                          3 +
                          colIndex}`,
                        lineHeight: '2rem',
                        backgroundColor: '#eee',
                      }}
                    />
                  )
                })}
              </StyledGrid>
            )
          })}
        </div>

        <GridHeading2 gridPreferences={gridPreferencesMatchedByViewportWidth}>
          グリッドシステム
        </GridHeading2>

        <div
          style={{
            gridColumn: '1/ -1',
            width: 'fit-content',
            maxWidth: '100%',
            margin: `${rem(verticalUnit)} 0 0`,
          }}
        >
          <div
            style={{
              display: 'flex',
              marginRight: rem(
                gridPreferencesMatchedByViewportWidth
                  ? -gridPreferencesMatchedByViewportWidth.margin
                  : 0,
              ),
              marginLeft: rem(
                gridPreferencesMatchedByViewportWidth
                  ? -gridPreferencesMatchedByViewportWidth.margin
                  : 0,
              ),
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: rem(
                  gridPreferencesMatchedByViewportWidth
                    ? gridPreferencesMatchedByViewportWidth.margin
                    : 0,
                ),
              }}
            />
            {gridPreferencesMatchedByViewportWidth && (
              <PreferencesTable
                gridPreferencesList={gridSystem.gridPreferencesList}
                gridPreferencesMatchedByViewportWidth={
                  gridPreferencesMatchedByViewportWidth
                }
              />
            )}
            <div
              style={{
                flexShrink: 0,
                width: rem(
                  gridPreferencesMatchedByViewportWidth
                    ? gridPreferencesMatchedByViewportWidth.margin
                    : 0,
                ),
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
              paddingLeft: '1rem',
            }}
          >
            <StyledButton
              type="button"
              style={{ marginRight: '1rem' }}
              onClick={() => {
                addBreakpoint()
              }}
            >
              新規ブレイクポイント
            </StyledButton>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '1rem',
              paddingLeft: '1rem',
            }}
          >
            <StyledButton
              type="button"
              style={{ marginRight: '1rem', marginLeft: 'auto' }}
              onClick={() => {
                resetGridSystem()
                resetFontSize()
              }}
            >
              初期設定に戻す
            </StyledButton>
          </div>
        </div>

        <SectionDisclosure
          summaryNode={<>ソースコード</>}
          gridPreferences={gridPreferencesMatchedByViewportWidth}
        >
          {gridPreferencesMatchedByViewportWidth && (
            <SourceCode
              gridSystem={gridSystem}
              gridPreferences={gridPreferencesMatchedByViewportWidth}
            />
          )}
        </SectionDisclosure>

        <SectionDisclosure
          summaryNode={<>デザインツールの設定</>}
          gridPreferences={gridPreferencesMatchedByViewportWidth}
        >
          {gridPreferencesMatchedByViewportWidth &&
            gridPreferencesMatchedByArtboardWidth && (
              <DesignToolsSettings
                gridSystem={gridSystem}
                gridPreferencesMatchedByViewportWidth={
                  gridPreferencesMatchedByViewportWidth
                }
                gridPreferencesMatchedByArtboardWidth={
                  gridPreferencesMatchedByArtboardWidth
                }
                preferencesTable={
                  <PreferencesTable
                    gridPreferencesList={
                      gridPreferencesMatchedByArtboardWidth
                        ? [gridPreferencesMatchedByArtboardWidth]
                        : []
                    }
                    gridPreferencesMatchedByViewportWidth={
                      gridPreferencesMatchedByViewportWidth
                    }
                  />
                }
                artboardWidth={artboardWidth}
                verticalUnit={verticalUnit}
              />
            )}
        </SectionDisclosure>

        <React.Suspense
          fallback={
            <div
              style={{
                gridColumn: '1 / -1',
                marginTop: rem(verticalUnit * 2),
              }}
            >
              読み込み中です……。
            </div>
          }
        >
          <Readme
            components={{
              wrapper: (props: any) => <React.Fragment {...props} />,
              h2: (props: any) => (
                <GridHeading2
                  gridPreferences={gridPreferencesMatchedByViewportWidth}
                  {...props}
                />
              ),
              p: (props: any) => (
                <GridParagraph
                  gridPreferences={gridPreferencesMatchedByViewportWidth}
                  {...props}
                />
              ),
            }}
          />
        </React.Suspense>
      </StyledGrid>

      <div style={{ marginTop: rem(verticalUnit * 2) }} />
    </StyledContainer>
  )
})
