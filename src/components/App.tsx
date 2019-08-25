import React from 'react'
import styled, { createGlobalStyle } from 'styled-components/macro'
import { precentage } from '../domain/CSSUnit'
import { MainPane } from './MainPane/MainPane'
import {
  resizeViewportWidth,
  toggleGridGuide,
  $gridPreferencesMatchedByViewportWidth,
} from '../effector/ui/store'
import { useStore } from 'effector-react'
import { BreakpointSlider } from './BreakpointSlider/BreakpointSlider'
import { Guide } from './Guide/Guide'
import { PreferencesPanel } from './PreferencesPanel/PreferencesPanel'

const GlobalStyle = createGlobalStyle`
  *,
  ::after,
  ::before {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
  }

  html {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  body {
    margin: 0;
    color: hsla(0, 0%, 0%, 0.87);
    text-align: left;
  }

  pre {
    overflow-x: auto;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }

  th {
    text-align: inherit;
  }

  input,
  button,
  select,
  textarea {
    margin: 0;
    padding: 0.25em 0.375em;
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
    background-color: transparent;
    border: 1px solid WindowFrame;
  }

  input[type="number"] {
    font-variant-numeric: tabular-nums;
  }

  summary {
    cursor: default;
  }

  [hidden] {
    display: none !important;
  }

  #root {
    display: contents;
  }
`

const RemStyle = React.memo<{}>(() => {
  const gridPreferences = useStore($gridPreferencesMatchedByViewportWidth)
  const ratio = gridPreferences ? gridPreferences.rem : 1
  return <style>{`html { font-size: ${precentage(ratio)} }`}</style>
})

const useResizeMonitor = () => {
  React.useEffect(() => {
    const onResize = () => {
      resizeViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', onResize)
    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [])
}

const useKeyboardShortcuts = () => {
  React.useEffect(() => {
    const onKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'g') {
        toggleGridGuide(undefined)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

const isSafari =
  !!navigator.userAgent.match(/safari/i) &&
  !navigator.userAgent.match(/chrome/i) &&
  typeof document.body.style.webkitFilter !== 'undefined' &&
  !(window as any).chrome

// fixme
const useScrollPositionKeeperForSafari = (
  ref: React.RefObject<HTMLDivElement>,
) => {
  React.useEffect(() => {
    const element = ref.current

    if (isSafari && element) {
      let lastScrollTime = performance.now()
      const updateScrollTime = () => {
        lastScrollTime = performance.now()
      }
      const userScrolled = () => {
        return lastScrollTime > performance.now() - 1000
      }

      const onWheel = updateScrollTime
      element.addEventListener('wheel', onWheel)

      const onKeyDown = (event: KeyboardEvent) => {
        const focusesOnInput =
          document.activeElement && document.activeElement.tagName === 'input'
        if (
          (event.key === 'ArrowUp' && !focusesOnInput) ||
          event.key === 'PageUp' ||
          event.key === 'Home'
        ) {
          updateScrollTime()
        }
      }
      window.addEventListener('keydown', onKeyDown)

      let prevScrollTop = element.scrollTop

      const onScroll = () => {
        if (element) {
          const currentScrollTop = element.scrollTop
          if (currentScrollTop === 0 && !userScrolled()) {
            element.scrollTo(0, prevScrollTop)
          }
          prevScrollTop = currentScrollTop
        }
      }
      element.addEventListener('scroll', onScroll, { passive: true })

      return () => {
        if (element) {
          element.removeEventListener('wheel', onWheel)
          window.removeEventListener('keydown', onKeyDown)
          element.removeEventListener('scroll', onScroll)
        }
      }
    }
  }, [ref])
}

const StyledApp = styled.div`
  position: relative;
  display: grid;
  grid-template-areas: 'header' 'body';
  grid-template-rows: auto 1fr;
  height: 100%;
`

const StyledHeader = styled.div`
  grid-area: header;
  min-width: 0;
`

const StyledBody = styled.div`
  grid-area: body;
  display: grid;
  grid-template-areas: 'layer';
  min-width: 0;
  overflow: auto;
`

const StyledBaseLayer = styled.div`
  grid-area: layer;
  width: 100%;
  height: fit-content;
`

const StyledOverlayLayer = styled.div`
  grid-area: layer;
  z-index: 1;
  width: 100%;
  pointer-events: none;
`

export const App = React.memo<{}>(() => {
  useResizeMonitor()
  useKeyboardShortcuts()

  const scrollableContainerElement = React.useRef<HTMLDivElement>(null)
  useScrollPositionKeeperForSafari(scrollableContainerElement)

  return (
    <>
      <StyledApp>
        <StyledHeader>
          <BreakpointSlider />
        </StyledHeader>

        <StyledBody ref={scrollableContainerElement}>
          <StyledBaseLayer>
            <MainPane />
          </StyledBaseLayer>

          <StyledOverlayLayer>
            <Guide />
          </StyledOverlayLayer>
        </StyledBody>

        <PreferencesPanel />
      </StyledApp>

      <GlobalStyle />
      <RemStyle />
    </>
  )
})
