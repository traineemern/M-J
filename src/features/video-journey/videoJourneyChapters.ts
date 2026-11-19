export interface VideoChapter {
  index: number
  start: number
  end: number
  title: string
}

export const VIDEO_JOURNEY_CHAPTERS: VideoChapter[] = [
  { index: 1, start: 0.0, end: 8.5, title: 'Every project starts on open ground.' },
  { index: 2, start: 9.0, end: 14.0, title: 'Our rig arrives on site.' },
  { index: 3, start: 15.0, end: 17.0, title: 'Our manager walks the site first.' },
  { index: 4, start: 17.0, end: 23.0, title: 'We check access, ground, and setbacks.' },
  { index: 5, start: 23.5, end: 26.5, title: 'The rig is set and level.' },
  { index: 6, start: 27.0, end: 35.0, title: 'We drill through every layer.' },
  { index: 7, start: 36.0, end: 41.0, title: 'Water collects at its natural level.' },
  { index: 8, start: 42.0, end: 45.0, title: 'Clean water found.' },
  { index: 9, start: 45.5, end: 50.67, title: 'Clean water, delivered to your home.' },
]

/**
 * Maps current video playback time (seconds) to the matching chapter.
 * Transitions update at 8.5 s, 14 s, 23.5 s, 35 s, 41 s, and 45.5 s.
 */
export function getChapterForTime(time: number): VideoChapter {
  const t = Math.max(0, time)

  if (t < 8.5) {
    return VIDEO_JOURNEY_CHAPTERS[0]
  } else if (t < 14.0) {
    return VIDEO_JOURNEY_CHAPTERS[1]
  } else if (t < 17.0) {
    return VIDEO_JOURNEY_CHAPTERS[2]
  } else if (t < 23.5) {
    return VIDEO_JOURNEY_CHAPTERS[3]
  } else if (t < 27.0) {
    return VIDEO_JOURNEY_CHAPTERS[4]
  } else if (t < 35.0) {
    return VIDEO_JOURNEY_CHAPTERS[5]
  } else if (t < 41.0) {
    return VIDEO_JOURNEY_CHAPTERS[6]
  } else if (t < 45.5) {
    return VIDEO_JOURNEY_CHAPTERS[7]
  } else {
    return VIDEO_JOURNEY_CHAPTERS[8]
  }
}

/**
 * Maps scroll progress (0 to 1) linearly to video time (0 to duration).
 */
export function mapScrollToTime(progress: number, duration: number): number {
  if (duration <= 0 || isNaN(duration)) return 0
  const clamped = Math.max(0, Math.min(progress, 1))
  return clamped * duration
}
