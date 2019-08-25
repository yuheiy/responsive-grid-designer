import { GridSystem } from './GridSystem'
import last from 'lodash/last'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'

interface SassDeclaration {
  name: string
  value: string | number
  toString: () => string
}

export const createDeclaration = (
  name: string,
  value: string | number,
): SassDeclaration => {
  return {
    name,
    value,
    toString() {
      return `${name}: ${value};`
    },
  }
}

export const createVariableDeclaration = (
  name: string,
  value: string | number,
): SassDeclaration => {
  return {
    name,
    value,
    toString() {
      return `$${name}: ${value};`
    },
  }
}

export const createMediaQueryVariableDeclaration = (
  name: string,
  value: number,
): SassDeclaration => {
  return {
    name,
    value,
    toString() {
      return `$${name}: "(min-width: #{em(${value})})";`
    },
  }
}

interface SassComment {
  text: string
  toString: () => string
}

export const createComment = (text: string): SassComment => {
  return {
    text,
    toString() {
      return `// ${text}`
    },
  }
}

interface SassRule {
  selectorOrAtRuleName: string
  children: (SassDeclaration | SassRule | string)[]
  toString: () => string
}

export const createRule = (
  selectorOrAtRuleName: string,
  children: (SassDeclaration | SassRule | string)[],
): SassRule => {
  return {
    selectorOrAtRuleName,
    children,
    toString() {
      let ret = ''
      ret += `${selectorOrAtRuleName} {`

      const hasChildren = Boolean(children.length)
      if (hasChildren) {
        ret += '\n'
        ret += children
          .map((declarationOrString) => {
            return String(declarationOrString)
              .split('\n')
              .map((line) => line && `${' '.repeat(2)}${line}`)
              .join('\n')
          })
          .join('\n')
        ret += '\n'
      }

      ret += '}'
      return ret
    },
  }
}

export const getMediaQueryVariables = (
  gridSystem: GridSystem,
): SassDeclaration[] => {
  const decls: SassDeclaration[] = []

  gridSystem.gridPreferencesList.forEach((gridPreferences) => {
    const adjacentNarrowerGridPreferences = gridSystem.getAdjacentNarrower(
      gridPreferences.id,
    )

    if (!adjacentNarrowerGridPreferences) {
      return
    }

    if (
      (['maxWidth', 'columns', 'gutter', 'margin', 'rem'] as const).some(
        (propertyName) => {
          return (
            adjacentNarrowerGridPreferences[propertyName] !==
            gridPreferences[propertyName]
          )
        },
      )
    ) {
      decls.push(
        createMediaQueryVariableDeclaration(
          `mq${decls.length + 1}`,
          gridPreferences.breakpointRange.minWidth,
        ),
      )
    }
  })

  return decls
}

const propertiesOrder = [
  'box-sizing',
  'display',
  'flex-wrap',
  'max-width',
  'margin-right',
  'margin-left',
  'padding-right',
  'padding-left',
]

const sortDeclarationOrder = (
  declarations: SassDeclaration[],
): SassDeclaration[] => {
  return declarations.slice().sort((a, b) => {
    return propertiesOrder.indexOf(a.name) - propertiesOrder.indexOf(b.name)
  })
}

export const getGridVariables = (
  gridSystem: GridSystem,
  mediaQueryVariables: SassDeclaration[],
): {
  maxWidth: Map<string, SassDeclaration>
  columns: Map<string, SassDeclaration>
  gutter: Map<string, SassDeclaration>
  margin: Map<string, SassDeclaration>
  rem: Map<string, SassDeclaration>
  keys: (
    ...properties: ('maxWidth' | 'columns' | 'gutter' | 'margin' | 'rem')[]
  ) => string[]
  toFlattenedArray: () => SassDeclaration[]
} => {
  const maxWidthList: { key: string; value?: number }[] = []
  const columnsList: { key: string; value: number }[] = []
  const gutterList: { key: string; value: number }[] = []
  const marginList: { key: string; value: number }[] = []
  const remList: { key: string; value: number }[] = []

  gridSystem.gridPreferencesList.forEach((gridPreferences) => {
    const lastMaxWidth = last(maxWidthList)
    const lastColumns = last(columnsList)
    const lastGutter = last(gutterList)
    const lastMargin = last(marginList)
    const lastRem = last(remList)

    const mediaQueryVariable = mediaQueryVariables.find(
      (mediaQueryVariable) => {
        return (
          mediaQueryVariable.value === gridPreferences.breakpointRange.minWidth
        )
      },
    )
    const rangeKey = mediaQueryVariable ? mediaQueryVariable.name : 'root'

    if (
      gridPreferences.breakpointRange.isFromStartingPoint ||
      (lastMaxWidth && lastMaxWidth.value !== gridPreferences.maxWidth)
    ) {
      maxWidthList.push({
        key: rangeKey,
        value: gridPreferences.maxWidth,
      })
    }

    if (
      gridPreferences.breakpointRange.isFromStartingPoint ||
      (lastColumns && lastColumns.value !== gridPreferences.columns)
    ) {
      columnsList.push({
        key: rangeKey,
        value: gridPreferences.columns,
      })
    }

    if (
      gridPreferences.breakpointRange.isFromStartingPoint ||
      (lastGutter && lastGutter.value !== gridPreferences.gutter)
    ) {
      gutterList.push({
        key: rangeKey,
        value: gridPreferences.gutter,
      })
    }

    if (
      gridPreferences.breakpointRange.isFromStartingPoint ||
      (lastMargin && lastMargin.value !== gridPreferences.margin)
    ) {
      marginList.push({
        key: rangeKey,
        value: gridPreferences.margin,
      })
    }

    if (
      gridPreferences.breakpointRange.isFromStartingPoint ||
      (lastRem && lastRem.value !== gridPreferences.rem)
    ) {
      remList.push({
        key: rangeKey,
        value: gridPreferences.rem,
      })
    }
  })

  const maxWidthVariableMap = maxWidthList.reduce((map, { key, value }) => {
    const prefix = key === 'root' ? '' : `${key}\\:`
    return map.set(
      key,
      createVariableDeclaration(
        `${prefix}grid-max-width`,
        typeof value === 'number' ? `rem(${value})` : 'none',
      ),
    )
  }, new Map<string, SassDeclaration>())

  const columnsVariableMap = columnsList.reduce((map, { key, value }) => {
    const prefix = key === 'root' ? '' : `${key}\\:`
    return map.set(
      key,
      createVariableDeclaration(`${prefix}grid-columns`, value),
    )
  }, new Map<string, SassDeclaration>())

  const gutterVariableMap = gutterList.reduce((map, { key, value }) => {
    const prefix = key === 'root' ? '' : `${key}\\:`
    return map.set(
      key,
      createVariableDeclaration(`${prefix}grid-gutter`, `rem(${value})`),
    )
  }, new Map<string, SassDeclaration>())

  const marginVariableMap = marginList.reduce((map, { key, value }) => {
    const prefix = key === 'root' ? '' : `${key}\\:`
    return map.set(
      key,
      createVariableDeclaration(`${prefix}grid-margin`, `rem(${value})`),
    )
  }, new Map<string, SassDeclaration>())

  const remVariableMap = remList.reduce((map, { key, value }) => {
    const prefix = key === 'root' ? '' : `${key}\\:`
    return map.set(
      key,
      createVariableDeclaration(
        `${prefix}root-font-size`,
        `percentage(${value})`,
      ),
    )
  }, new Map<string, SassDeclaration>())

  const get = (
    property: 'maxWidth' | 'columns' | 'gutter' | 'margin' | 'rem',
  ) => {
    switch (property) {
      case 'maxWidth':
        return maxWidthVariableMap
      case 'columns':
        return columnsVariableMap
      case 'gutter':
        return gutterVariableMap
      case 'margin':
        return marginVariableMap
      case 'rem':
        return remVariableMap
    }
  }

  return {
    maxWidth: maxWidthVariableMap,
    columns: columnsVariableMap,
    gutter: gutterVariableMap,
    margin: marginVariableMap,
    rem: remVariableMap,
    keys(...properties) {
      const concatedKeys = properties.reduce<string[]>((array, property) => {
        return [...array, ...get(property).keys()]
      }, [])
      return sortBy(uniq(concatedKeys), (key) => {
        if (key === 'root') {
          return 0
        }
        return Number(key.replace('mq', ''))
      })
    },
    toFlattenedArray() {
      return [
        ...maxWidthVariableMap.values(),
        ...columnsVariableMap.values(),
        ...gutterVariableMap.values(),
        ...marginVariableMap.values(),
        ...remVariableMap.values(),
      ]
    },
  }
}

const emFunctionRule = `@function em($px, $context: 16) {
  @return ($px / $context * 1em);
}`

const remFunctionRule = `@function rem($px) {
  @return ($px / 16 * 1rem);
}`

export const getSCSSCode = (gridSystem: GridSystem): string => {
  const mediaQueryVariables = getMediaQueryVariables(gridSystem)
  const gridVariables = getGridVariables(gridSystem, mediaQueryVariables)

  const htmlChildren: (SassDeclaration | SassRule | string)[] = []
  gridVariables.keys('rem').forEach((rangeKey) => {
    const rangeChildren: (SassDeclaration | string)[] = []
    const remVariable = gridVariables.rem.get(rangeKey)

    if (remVariable) {
      rangeChildren.push(createDeclaration('font-size', `$${remVariable.name}`))
    }

    if (rangeKey === 'root') {
      htmlChildren.push(...rangeChildren)
    } else {
      htmlChildren.push('', createRule(`@media #{$${rangeKey}}`, rangeChildren))
    }
  })
  const htmlRule = createRule('html', htmlChildren)

  let containerChildren: (SassDeclaration | SassRule | string)[] = [
    createDeclaration('box-sizing', 'border-box'),
    createDeclaration('margin-right', 'auto'),
    createDeclaration('margin-left', 'auto'),
  ]
  gridVariables.keys('maxWidth', 'gutter').forEach((rangeKey) => {
    const rangeChildren: (SassDeclaration | string)[] = []
    const maxWidthVariable = gridVariables.maxWidth.get(rangeKey)
    const gutterVariable = gridVariables.gutter.get(rangeKey)

    if (maxWidthVariable) {
      rangeChildren.push(
        createDeclaration('max-width', `$${maxWidthVariable.name}`),
      )
    }

    if (gutterVariable) {
      rangeChildren.push(
        createDeclaration('padding-right', `$${gutterVariable.name} / 2`),
      )
      rangeChildren.push(
        createDeclaration('padding-left', `$${gutterVariable.name} / 2`),
      )
    }

    if (rangeKey === 'root') {
      containerChildren.push(...rangeChildren)
      containerChildren = sortDeclarationOrder(
        containerChildren as SassDeclaration[],
      )
    } else {
      containerChildren.push(
        '',
        createRule(`@media #{$${rangeKey}}`, rangeChildren),
      )
    }
  })
  const containerRule = createRule('.container', containerChildren)

  const rowChildren: (SassDeclaration | SassRule | string)[] = [
    createDeclaration('display', 'flex'),
    createDeclaration('flex-wrap', 'wrap'),
  ]
  gridVariables.keys('gutter').forEach((rangeKey) => {
    const rangeChildren: (SassDeclaration | string)[] = []
    const gutterVariable = gridVariables.gutter.get(rangeKey)

    if (gutterVariable) {
      rangeChildren.push(
        createDeclaration('margin-right', `$${gutterVariable.name} / 2 * -1`),
      )
      rangeChildren.push(
        createDeclaration('margin-left', `$${gutterVariable.name} / 2 * -1`),
      )
    }

    if (rangeKey === 'root') {
      rowChildren.push(...rangeChildren)
    } else {
      rowChildren.push('', createRule(`@media #{$${rangeKey}}`, rangeChildren))
    }
  })
  const rowRule = createRule('.row', rowChildren)

  const colChildren: (SassDeclaration | SassRule | string)[] = [
    createDeclaration('box-sizing', 'border-box'),
  ]
  gridVariables.keys('gutter').forEach((rangeKey) => {
    const rangeChildren: (SassDeclaration | string)[] = []
    const gutterVariable = gridVariables.gutter.get(rangeKey)

    if (gutterVariable) {
      rangeChildren.push(
        createDeclaration('padding-right', `$${gutterVariable.name} / 2`),
      )
      rangeChildren.push(
        createDeclaration('padding-left', `$${gutterVariable.name} / 2`),
      )
    }

    if (rangeKey === 'root') {
      colChildren.push(...rangeChildren)
    } else {
      colChildren.push('', createRule(`@media #{$${rangeKey}}`, rangeChildren))
    }
  })
  const colRule = createRule('.col', colChildren)

  const colSpanRules = gridVariables.keys('columns').map((rangeKey) => {
    const columnsVariable = gridVariables.columns.get(rangeKey)

    if (!columnsVariable) {
      throw new Error('')
    }

    const selector = `.col.-${
      rangeKey === 'root' ? '' : `${rangeKey}\\:`
    }s#{$numerator}of#{$denominator}`
    const decls = [
      createDeclaration('width', 'percentage($numerator / $denominator)'),
    ]

    return createRule(
      `@for $denominator from 1 through $${columnsVariable.name}`,
      [
        createRule('@for $numerator from 1 through $denominator', [
          createRule(
            selector,
            rangeKey === 'root'
              ? decls
              : [createRule(`@media #{$${rangeKey}}`, decls)],
          ),
        ]),
      ],
    )
  })

  const colOffsetRules = gridVariables.keys('columns').map((rangeKey) => {
    const columnsVariable = gridVariables.columns.get(rangeKey)

    if (!columnsVariable) {
      throw new Error('')
    }

    const selector = `.col.-${
      rangeKey === 'root' ? '' : `${rangeKey}\\:`
    }o#{$numerator}of#{$denominator}`
    const decls = [
      createDeclaration('margin-left', 'percentage($numerator / $denominator)'),
    ]

    return createRule(
      `@for $denominator from 1 through $${columnsVariable.name}`,
      [
        createRule('@for $numerator from 1 through $denominator', [
          createRule(
            selector,
            rangeKey === 'root'
              ? decls
              : [createRule(`@media #{$${rangeKey}}`, decls)],
          ),
        ]),
      ],
    )
  })

  return [
    createComment('Unit'),
    emFunctionRule,
    '',
    remFunctionRule,
    '',
    createComment('Media Query'),
    ...mediaQueryVariables,
    '',
    createComment('Grid'),
    ...gridVariables.toFlattenedArray(),
    '',
    createComment('Base'),
    htmlRule,
    '',
    createComment('Component'),
    containerRule,
    '',
    rowRule,
    '',
    colRule,
    '',
    colSpanRules.join('\n\n'),
    '',
    colOffsetRules.join('\n\n'),
    '',
  ].join('\n')
}
