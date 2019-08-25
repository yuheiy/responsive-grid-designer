import React from 'react'
import {
  PanelSide,
  changePanelSide,
  toggleGridGuide,
  $gridPreferencesMatchedByViewportWidth,
  $displaysGridGuide,
  $panelSide,
} from '../../effector/ui/store'
import styled from 'styled-components/macro'
import {
  GridMaxWidthField,
  GridColumnsField,
  GridGutterField,
  GridMarginField,
  GridRemField,
  demoElementFields,
  PanelSideFields,
} from './formFields'
import {
  BreakpointRangeStatus,
  StyledBreakpointRangeStatus,
} from './BreakpointRangeStatus'
import { $gridSystem } from '../../effector/document/store'
import { useStore } from 'effector-react'

const StyledPreferencesPanel = styled.div<{ panelSide: PanelSide }>`
  position: absolute;
  top: ${({ panelSide }) => ['leftTop', 'rightTop'].includes(panelSide) && 0};
  right: ${({ panelSide }) =>
    ['rightTop', 'rightBottom'].includes(panelSide) && 0};
  bottom: ${({ panelSide }) =>
    ['leftBottom', 'rightBottom'].includes(panelSide) && 0};
  left: ${({ panelSide }) =>
    ['leftTop', 'leftBottom'].includes(panelSide) && 0};
  z-index: 1;
  overflow: auto;
  max-height: calc(100% - 24px);
  margin-top: 24px;
  margin-right: 16px;
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.87);
  background-color: hsla(0, 0%, 0%, 0.75);
  backdrop-filter: blur(4px);
`

const StyledDisclosure = styled.details``

const StyledDisclosureHeader = styled.summary`
  padding: 8px 12px;
  color: hsla(0, 0%, 100%, 0.6);
`

const StyledDisclosureHeaderInner = styled.span`
  color: hsla(0, 0%, 100%, 0.87);
`

const StyledDisclosureBody = styled.div`
  padding: 4px 12px 8px;
`

const StyledSeparator = styled.div`
  height: 1px;
  background-color: #000;
`

const StyledControlFieldOneline = styled.div`
  padding: 8px 12px;
`

const StyledControlFieldStack = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 12px;

  ${StyledBreakpointRangeStatus} + & {
    margin-top: 16px;
  }
`

export const PreferencesPanel = React.memo<{}>(() => {
  const gridSystem = useStore($gridSystem)
  const gridPreferencesMatchedByViewportWidth = useStore(
    $gridPreferencesMatchedByViewportWidth,
  )
  const displaysGridGuide = useStore($displaysGridGuide)
  const panelSide = useStore($panelSide)

  if (!gridPreferencesMatchedByViewportWidth) {
    return null
  }

  const adjacentNarrowerGridPreferences = gridSystem.getAdjacentNarrower(
    gridPreferencesMatchedByViewportWidth.id,
  )
  const adjacentWiderGridPreferences = gridSystem.getAdjacentWider(
    gridPreferencesMatchedByViewportWidth.id,
  )

  return (
    <StyledPreferencesPanel role="group" panelSide={panelSide}>
      <StyledControlFieldOneline>
        <label style={{ display: 'inline-flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={displaysGridGuide}
            style={{ marginRight: 4 }}
            onChange={(event) => {
              toggleGridGuide(event.target.checked)
            }}
          />
          ガイドの表示（<kbd>G</kbd>）
        </label>
      </StyledControlFieldOneline>

      <StyledSeparator />

      <StyledDisclosure open>
        <StyledDisclosureHeader>
          <StyledDisclosureHeaderInner>
            グリッドシステム
          </StyledDisclosureHeaderInner>
        </StyledDisclosureHeader>

        <StyledDisclosureBody>
          <BreakpointRangeStatus
            gridPreferences={gridPreferencesMatchedByViewportWidth}
            adjacentNarrowerGridPreferences={adjacentNarrowerGridPreferences}
            adjacentWiderGridPreferences={adjacentWiderGridPreferences}
          />

          <StyledControlFieldStack>
            <GridColumnsField
              gridPreferencesId={gridPreferencesMatchedByViewportWidth.id}
            />
            <GridGutterField
              gridPreferencesId={gridPreferencesMatchedByViewportWidth.id}
            />
            <GridMarginField
              gridPreferencesId={gridPreferencesMatchedByViewportWidth.id}
            />
            <GridMaxWidthField
              gridPreferencesId={gridPreferencesMatchedByViewportWidth.id}
            />
            <GridRemField
              gridPreferencesId={gridPreferencesMatchedByViewportWidth.id}
            />
          </StyledControlFieldStack>
        </StyledDisclosureBody>
      </StyledDisclosure>

      {demoElementFields.map(
        ({ label, element, StartInput, EndInput, FontSizeInput }) => {
          return (
            <React.Fragment key={element}>
              <StyledSeparator />

              <StyledDisclosure key={element}>
                <StyledDisclosureHeader>
                  <StyledDisclosureHeaderInner>
                    {label}
                  </StyledDisclosureHeaderInner>
                </StyledDisclosureHeader>

                <StyledDisclosureBody>
                  <StyledControlFieldStack>
                    <StartInput
                      gridPreferencesId={
                        gridPreferencesMatchedByViewportWidth.id
                      }
                    />
                    <EndInput
                      gridPreferencesId={
                        gridPreferencesMatchedByViewportWidth.id
                      }
                    />
                    <FontSizeInput />
                  </StyledControlFieldStack>
                </StyledDisclosureBody>
              </StyledDisclosure>
            </React.Fragment>
          )
        },
      )}

      <StyledSeparator />

      <StyledControlFieldOneline>
        <PanelSideFields
          panelSide={panelSide}
          changePanelSide={changePanelSide}
        />
      </StyledControlFieldOneline>
    </StyledPreferencesPanel>
  )
})
