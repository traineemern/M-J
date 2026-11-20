import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type Candidate = { element: HTMLElement; setActive: (active: boolean) => void }
const visibleCandidates = new Set<Candidate>()

function electPulseOwner() {
  const owner = [...visibleCandidates].find((candidate) => candidate.element.isConnected)
  visibleCandidates.forEach((candidate) => candidate.setActive(candidate === owner))
}

export function useVisibleGlowPulse(enabled: boolean) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!enabled || reducedMotion || !element || !('IntersectionObserver' in window)) return
    let disposed = false
    let lowBattery = false
    const candidate: Candidate = { element, setActive }
    const observer = new IntersectionObserver(([entry]) => {
      if (disposed || lowBattery) return
      if (entry.isIntersecting) visibleCandidates.add(candidate)
      else visibleCandidates.delete(candidate)
      electPulseOwner()
    }, { threshold: 0.1 })
    observer.observe(element)

    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number; addEventListener?: (type: string, listener: () => void) => void }> }
    nav.getBattery?.().then((battery) => {
      const update = () => {
        lowBattery = battery.level <= 0.15
        if (lowBattery) {
          visibleCandidates.delete(candidate)
          setActive(false)
          electPulseOwner()
        }
      }
      update()
      battery.addEventListener?.('levelchange', update)
    }).catch(() => {})

    return () => {
      disposed = true
      observer.disconnect()
      visibleCandidates.delete(candidate)
      electPulseOwner()
    }
  }, [enabled, reducedMotion])

  return { pulseRef: ref, pulseActive: active }
}
