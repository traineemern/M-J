export type SplitMode = 'chars' | 'words' | 'lines'

export interface SplitTextResult {
  chars: HTMLElement[]
  words: HTMLElement[]
  lines: HTMLElement[]
  reSplit: () => void
  revert: () => void
}

function makePart(text: string, type: 'char' | 'word'): HTMLSpanElement {
  const span = document.createElement('span')
  span.className = type === 'char' ? 'typo-display__char' : 'motion-split-word'
  span.dataset.splitPart = type
  span.setAttribute('aria-hidden', 'true')
  span.textContent = text
  if (type === 'char') span.style.whiteSpace = 'pre'
  return span
}

export function splitElement(element: HTMLElement, mode: SplitMode): SplitTextResult {
  const originalText = element.textContent ?? ''
  const originalAriaLabel = element.getAttribute('aria-label')
  let chars: HTMLElement[] = []
  let words: HTMLElement[] = []
  let lines: HTMLElement[] = []
  let generation = 0

  const restore = () => {
    generation += 1
    element.replaceChildren(document.createTextNode(originalText))
    if (originalAriaLabel === null) element.removeAttribute('aria-label')
    else element.setAttribute('aria-label', originalAriaLabel)
    element.removeAttribute('data-split-ready')
    chars = []
    words = []
    lines = []
  }

  const render = () => {
    const renderId = ++generation
    element.replaceChildren()
    element.setAttribute('aria-label', originalText)
    element.dataset.splitReady = 'true'

    if (mode === 'chars') {
      chars = Array.from(originalText, (character) => makePart(character, 'char'))
      element.append(...chars)
      words = []
      lines = []
      return
    }

    const tokens = originalText.match(/\s+|\S+/g) ?? []
    const wordParts: Array<{ word: HTMLSpanElement; leadingSpace: string }> = []
    let pendingSpace = ''

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        pendingSpace += token
        continue
      }
      const word = makePart(token, 'word')
      element.append(word)
      if (pendingSpace) element.append(document.createTextNode(pendingSpace))
      wordParts.push({ word, leadingSpace: pendingSpace })
      pendingSpace = ''
    }
    if (pendingSpace) element.append(document.createTextNode(pendingSpace))
    words = wordParts.map(({ word }) => word)
    chars = []

    if (mode !== 'lines') {
      lines = []
      return
    }

    const groupLines = () => {
      if (renderId !== generation) return
      const groups: Array<Array<{ word: HTMLSpanElement; leadingSpace: string }>> = []
      for (const part of wordParts) {
        const top = part.word.offsetTop
        let group = groups[groups.length - 1]
        if (!group || group[0].word.offsetTop !== top) {
          group = []
          groups.push(group)
        }
        group.push(part)
      }

      const fragment = document.createDocumentFragment()
      lines = groups.map((group) => {
        const line = document.createElement('span')
        line.dataset.splitLine = 'true'
        line.setAttribute('aria-hidden', 'true')
        group.forEach(({ word, leadingSpace }, index) => {
          if (index > 0 && leadingSpace) line.append(document.createTextNode(leadingSpace))
          line.append(word)
        })
        fragment.append(line)
        return line
      })
      element.replaceChildren(fragment)
    }

    void document.fonts.ready.then(() => requestAnimationFrame(groupLines))
    requestAnimationFrame(groupLines)
  }

  render()

  return {
    get chars() {
      return chars
    },
    get words() {
      return words
    },
    get lines() {
      return lines
    },
    reSplit() {
      if (mode === 'lines') render()
    },
    revert: restore,
  }
}

export function splitText(root: ParentNode): SplitTextResult[] {
  const results: SplitTextResult[] = []
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    const mode = element.dataset.split
    if (mode === 'chars' || mode === 'words' || mode === 'lines') {
      results.push(splitElement(element, mode))
    }
  })
  return results
}
