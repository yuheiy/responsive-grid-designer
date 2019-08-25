import React from 'react'
import styled from 'styled-components/macro'
import {
  GRID_PREFERENCES_MAX_WIDTH_LABEL,
  GRID_PREFERENCES_MAX_WIDTH_UNIT,
  GRID_PREFERENCES_COLUMNS_LABEL,
  GRID_PREFERENCES_GUTTER_LABEL,
  GRID_PREFERENCES_GUTTER_UNIT,
  GRID_PREFERENCES_MARGIN_UNIT,
  GRID_PREFERENCES_MARGIN_LABEL,
  GRID_PREFERENCES_REM_LABEL,
  GRID_PREFERENCES_REM_UNIT,
  GRID_PREFERENCES_HEADING1_LABEL,
  GRID_PREFERENCES_HEADING2_LABEL,
  GRID_PREFERENCES_PARAGRAPH_LABEL,
  GRID_PREFERENCES_OFFSET_POSITION_START_LABEL,
  GRID_PREFERENCES_OFFSET_POSITION_END_LABEL,
} from '../../domain/GridPreferences'
import {
  useGridMaxWidthInput,
  useGridColumnsInput,
  useGridGutterInput,
  useGridMarginInput,
  useGridRemInput,
  useDemoPositionInput,
} from '../../effector/document/useInput'
import {
  PanelSide,
  FONT_SIZE_LABEL,
  FONT_SIZE_UNIT,
} from '../../effector/ui/store'
import { useDemoFontSizeInput } from '../../effector/ui/useInput'

const StyledControlField = styled.label``

const StyledControlFieldLabel = styled.span`
  display: block;
  font-size: 10px;
  color: hsla(0, 0%, 100%, 0.6);
`

const StyledControl = styled.span`
  display: flex;
  align-items: flex-end;
  margin-top: 4px;
`

const StyledControlInput = styled.span`
  flex-grow: 1;
  position: relative;
`

const StyledNumberInput = styled.input`
  width: 100%;
  background-color: #000;
  border: 0;
  border-radius: 2px;
`

const StyledControlInputOverlay = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.25em 0.375em;
  pointer-events: none;
`

const StyledControlUnit = styled.span`
  margin-left: 4px;
  padding-top: ${14 * 0.25}px;
  padding-bottom: ${14 * 0.25}px;
  font-size: 10px;
  color: hsla(0, 0%, 100%, 0.6);
`

type GridInputProps = { gridPreferencesId: string }

export const GridMaxWidthField = React.memo<GridInputProps>(
  ({ gridPreferencesId }) => {
    const [inputProps, shouldDisplayNone] = useGridMaxWidthInput(
      gridPreferencesId,
    )

    return (
      <StyledControlField>
        <StyledControlFieldLabel>
          {GRID_PREFERENCES_MAX_WIDTH_LABEL}
        </StyledControlFieldLabel>
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
      </StyledControlField>
    )
  },
)

export const [GridColumnsField, GridGutterField, GridMarginField] = ([
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
      <StyledControlField>
        <StyledControlFieldLabel>{label}</StyledControlFieldLabel>
        <StyledControl>
          <StyledControlInput>
            <StyledNumberInput {...inputProps} aria-label={label} />
          </StyledControlInput>
          {unit && <StyledControlUnit>{unit}</StyledControlUnit>}
        </StyledControl>
      </StyledControlField>
    )
  })
})

export const GridRemField = React.memo<GridInputProps>(
  ({ gridPreferencesId }) => {
    const inputProps = useGridRemInput(gridPreferencesId)

    return (
      <StyledControlField>
        <StyledControlFieldLabel>
          {GRID_PREFERENCES_REM_LABEL}
        </StyledControlFieldLabel>
        <StyledControl>
          <StyledControlInput>
            <StyledNumberInput
              {...inputProps}
              aria-label={GRID_PREFERENCES_REM_LABEL}
            />
          </StyledControlInput>
          <StyledControlUnit>{GRID_PREFERENCES_REM_UNIT}</StyledControlUnit>
        </StyledControl>
      </StyledControlField>
    )
  },
)

export const demoElementFields = ([
  ['heading1', GRID_PREFERENCES_HEADING1_LABEL],
  ['heading2', GRID_PREFERENCES_HEADING2_LABEL],
  ['paragraph', GRID_PREFERENCES_PARAGRAPH_LABEL],
] as const).map(([element, label]) => {
  return {
    label,
    element,
    StartInput: React.memo<GridInputProps>(({ gridPreferencesId }) => {
      const inputProps = useDemoPositionInput(
        gridPreferencesId,
        element,
        'start',
      )
      return (
        <StyledControlField>
          <StyledControlFieldLabel>
            {GRID_PREFERENCES_OFFSET_POSITION_START_LABEL}
          </StyledControlFieldLabel>

          <StyledControl>
            <StyledControlInput>
              <StyledNumberInput
                {...inputProps}
                aria-label={GRID_PREFERENCES_OFFSET_POSITION_START_LABEL}
              />
            </StyledControlInput>
          </StyledControl>
        </StyledControlField>
      )
    }),
    EndInput: React.memo<GridInputProps>(({ gridPreferencesId }) => {
      const inputProps = useDemoPositionInput(gridPreferencesId, element, 'end')
      return (
        <StyledControlField>
          <StyledControlFieldLabel>
            {GRID_PREFERENCES_OFFSET_POSITION_END_LABEL}
          </StyledControlFieldLabel>

          <StyledControl>
            <StyledControlInput>
              <StyledNumberInput
                {...inputProps}
                aria-label={GRID_PREFERENCES_OFFSET_POSITION_END_LABEL}
              />
            </StyledControlInput>
          </StyledControl>
        </StyledControlField>
      )
    }),
    FontSizeInput: React.memo<{}>(() => {
      const inputProps = useDemoFontSizeInput(element)

      return (
        <StyledControlField>
          <StyledControlFieldLabel>{FONT_SIZE_LABEL}</StyledControlFieldLabel>

          <StyledControl>
            <StyledControlInput>
              <StyledNumberInput {...inputProps} aria-label={FONT_SIZE_LABEL} />
            </StyledControlInput>
            <StyledControlUnit>{FONT_SIZE_UNIT}</StyledControlUnit>
          </StyledControl>
        </StyledControlField>
      )
    }),
  }
})

const StyledPanelSideFields = styled.div`
  display: flex;
  align-items: center;
`

const StyledPanelSideFieldsLabel = styled.div`
  margin-right: 16px;
`

const StyledPanelSideFieldRow = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-right: -4px;
  margin-left: -4px;
`

const StyledPanelSideField = styled.label`
  margin-right: 4px;
  margin-left: 4px;
`

const StyledPanelSideInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

const StyledPanelSideControl = styled.span`
  display: flex;
  justify-content: center;
  width: 24px;
  line-height: 24px;
  border-radius: 2px;

  ${StyledPanelSideInput}:checked + & {
    background-color: #000;
  }

  ${StyledPanelSideInput}:focus + & {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color;
  }
`

export const PanelSideFields: React.FunctionComponent<{
  panelSide: PanelSide
  changePanelSide: (panelSide: PanelSide) => void
}> = ({ panelSide, changePanelSide }) => {
  const fieldsLabel = '表示位置'

  return (
    <StyledPanelSideFields role="radiogroup" aria-label={fieldsLabel}>
      <StyledPanelSideFieldsLabel>{fieldsLabel}</StyledPanelSideFieldsLabel>
      <StyledPanelSideFieldRow>
        {([
          ['↖︎', '左上', 'leftTop'],
          ['↙︎', '左下', 'leftBottom'],
          ['↘︎', '右下', 'rightBottom'],
          ['↗︎', '右上', 'rightTop'],
        ] as const).map(([label, accessibleLabel, value]) => {
          return (
            <StyledPanelSideField key={value}>
              <StyledPanelSideInput
                type="radio"
                name="panelSide"
                value={value}
                checked={panelSide === value}
                aria-label={accessibleLabel}
                onChange={() => {
                  changePanelSide(value)
                }}
              />
              <StyledPanelSideControl>{label}</StyledPanelSideControl>
            </StyledPanelSideField>
          )
        })}
      </StyledPanelSideFieldRow>
    </StyledPanelSideFields>
  )
}
