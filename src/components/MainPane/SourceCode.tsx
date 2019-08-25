import React from 'react'
import styled from 'styled-components/macro'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'
import { GridPreferences } from '../../domain/GridPreferences'
import { rem } from '../../domain/CSSUnit'
import { GridSystem } from '../../domain/GridSystem'
import { Heading3 } from './baseElements'

const StyledSourceCode = styled.div<{ gridPreferences: GridPreferences }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  column-gap: ${({ gridPreferences }) => rem(gridPreferences.gutter)};
`

const StyledCol = styled.div``

const StyledPre = styled.pre`
  height: 64rem;
  overflow: auto;
`

export const SourceCode = React.memo<{
  gridSystem: GridSystem
  gridPreferences: GridPreferences
}>(({ gridSystem, gridPreferences }) => {
  return (
    <StyledSourceCode gridPreferences={gridPreferences}>
      <StyledCol>
        <Heading3>HTML</Heading3>
        <Highlight
          {...defaultProps}
          code={`<div class="container">
  <div class="row">
    <div class="col -s12of12">
      <h1>レスポンシブグリッドデザイナー</h1>
    </div>
  </div>
  <div class="row">
    <div class="col -s7of12">
      <p>レスポンシブデザインを前提にしたグリッドシステムがデザインできるツールです。このページを開いているウィンドウの幅をリサイズすると、それに反応して<em>ページ全体のレイアウト</em>が変化します。</p>
    </div>
  </div>
  <div class="row">
    <div class="col -s12of12">
      <h2>デモ</h2>
    </div>
  </div>
  <div class="row">
    <div class="col -s4of12">4 of 12</div>
    <div class="col -s4of12">4 of 12</div>
    <div class="col -s4of12">4 of 12</div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col -s1of12">1 of 12</div>
    <div class="col -s3of12">3 of 12</div>
    <div class="col -s6of12">
      <div class="row">
        <div class="col -s3of6">3 of 6</div>
        <div class="col -s2of6 -o1of6">2 of 6, offset 1</div>
      </div>
    </div>
  </div>
</div>
`}
          language="markup"
          theme={theme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <StyledPre
              className={className}
              style={{ ...style, marginTop: '1rem', marginBottom: 0 }}
            >
              <code style={{ fontSize: '1rem' }}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </code>
            </StyledPre>
          )}
        </Highlight>
      </StyledCol>

      <StyledCol>
        <Heading3>SCSS</Heading3>
        <Highlight
          {...defaultProps}
          code={gridSystem.toSCSSCode()}
          language="scss"
          theme={theme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <StyledPre
              className={className}
              style={{ ...style, marginTop: '1rem', marginBottom: 0 }}
            >
              <code style={{ fontSize: '1rem' }}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </code>
            </StyledPre>
          )}
        </Highlight>
      </StyledCol>
    </StyledSourceCode>
  )
})
