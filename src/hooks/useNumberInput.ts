import React from 'react'

const noop = () => {}

const normalize = (value: number, max: number, min: number): number => {
  return Math.max(min, Math.min(value, max))
}

const requiredJSValueToInputValue = (value: number): string => {
  return String(value)
}

const requiredInputValueToJSValue = (value: string): number => {
  return Number(value)
}

interface RequiredNumberInputProps {
  type: 'number'
  value: string
  required: true
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onFocus: React.FocusEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
}

const useRequiredNumberInput = ({
  value,
  changeValue,
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
}: {
  value: number
  changeValue: (value: number) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): RequiredNumberInputProps => {
  const [inputValue, setInputValue] = React.useState(
    requiredJSValueToInputValue(value),
  )
  const [isFocused, setIsFocused] = React.useState(false)

  React.useEffect(() => {
    const nextInputValue = requiredJSValueToInputValue(value)
    if (!isFocused && inputValue !== nextInputValue) {
      setInputValue(nextInputValue)
    }
  }, [isFocused, value, inputValue])

  return {
    type: 'number',
    value: inputValue,
    required: true,
    onChange: (event) => {
      onChange(event)

      setInputValue(event.target.value)

      const nextValue = requiredInputValueToJSValue(event.target.value)
      if (value !== nextValue) {
        changeValue(nextValue)
      }
    },
    onFocus: (event) => {
      onFocus(event)

      setIsFocused(true)
    },
    onBlur: (event) => {
      onBlur(event)

      setIsFocused(false)
    },
  }
}

interface RequiredNumberInputWithNormalizationProps
  extends RequiredNumberInputProps {
  max: number
  min: number
}

export const useRequiredNumberInputWithNormalization = ({
  value,
  max,
  min,
  changeValue,
  onChange,
  onFocus,
  onBlur,
}: {
  value: number
  max: number
  min: number
  changeValue: (value: number) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): RequiredNumberInputWithNormalizationProps => {
  const baseProps = useRequiredNumberInput({
    value,
    changeValue: (requestedValue) => {
      const nextValue = normalize(requestedValue, max, min)
      if (value !== nextValue) {
        changeValue(nextValue)
      }
    },
    onChange,
    onFocus,
    onBlur,
  })

  return {
    ...baseProps,
    max,
    min,
  }
}

const optionalJSValueToInputValue = (value?: number) => {
  return typeof value === 'number' ? String(value) : ''
}

const optionalInputValueToJSValue = (value: string): number | undefined => {
  if (value) {
    return Number(value)
  }
}

interface OptionalNumberInputProps {
  type: 'number'
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onFocus: React.FocusEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
}

const useOptionalNumberInput = ({
  value,
  changeValue,
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
}: {
  value?: number
  changeValue: (value?: number) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): OptionalNumberInputProps => {
  const [inputValue, setInputValue] = React.useState(
    optionalJSValueToInputValue(value),
  )
  const [isFocused, setIsFocused] = React.useState(false)

  React.useEffect(() => {
    const nextInputValue = optionalJSValueToInputValue(value)
    if (!isFocused && inputValue !== nextInputValue) {
      setInputValue(nextInputValue)
    }
  }, [isFocused, value, inputValue])

  return {
    type: 'number',
    value: inputValue,
    onChange: (event) => {
      onChange(event)

      setInputValue(event.target.value)

      const nextValue = optionalInputValueToJSValue(event.target.value)
      if (value !== nextValue) {
        changeValue(nextValue)
      }
    },
    onFocus: (event) => {
      onFocus(event)

      setIsFocused(true)
    },
    onBlur: (event) => {
      onBlur(event)

      setIsFocused(false)
    },
  }
}

interface OptionalNumberInputWithNormalizationProps
  extends OptionalNumberInputProps {
  max: number
  min: number
}

export const useOptionalNumberInputWithNormalization = ({
  value,
  max,
  min,
  changeValue,
  onChange,
  onFocus,
  onBlur,
}: {
  value?: number
  max: number
  min: number
  changeValue: (value?: number) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): OptionalNumberInputWithNormalizationProps => {
  const baseProps = useOptionalNumberInput({
    value,
    changeValue: (requestedValue) => {
      const nextValue =
        typeof requestedValue === 'number'
          ? normalize(requestedValue, max, min)
          : requestedValue
      if (value !== nextValue) {
        changeValue(nextValue)
      }
    },
    onChange,
    onFocus,
    onBlur,
  })

  return {
    ...baseProps,
    max,
    min,
  }
}
