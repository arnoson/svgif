import { getFrameDuration, setSVGStyle, shouldIgnoreFrame } from './utils'

const createFrameAnimation = (
  frameDuration: number,
  animationDuration: number
) => `@keyframes svgif-frame-${frameDuration}-ms {
  0%,
  ${(frameDuration / animationDuration) * 100}% {
    visibility: visible;
  }
  ${((frameDuration + 1) / animationDuration) * 100}%,
  100% {
    visibility: hidden;
  }
}`

export default function svgif(
  svg: SVGElement,
  { frameDuration = 500, loop = true, clone = false } = {}
) {
  svg = clone ? (svg.cloneNode(true) as SVGElement) : svg
  svg.classList.add('svgif')
  svg.toggleAttribute('data-loop', loop)

  const frames = Array.from(svg.children) as HTMLElement[]
  const differentFrameDurations = new Set() as Set<number>
  let animationDuration = 0

  for (const frame of frames) {
    if (shouldIgnoreFrame(frame)) continue

    const frameStart = animationDuration
    const duration = getFrameDuration(frame) || frameDuration

    animationDuration += duration
    differentFrameDurations.add(duration)

    frame.classList.add('svgif-frame')
    frame.style.setProperty('--delay', `${frameStart}ms`)
    frame.style.setProperty('--animation', `svgif-frame-${duration}-ms`)
  }

  const style = Array.from(differentFrameDurations)
    .map((duration) => createFrameAnimation(duration, animationDuration))
    .join('\n')

  svg.style.setProperty('--animation-duration', `${animationDuration}ms`)
  svg.style.setProperty('--animation-iteration-count', loop ? 'infinite' : '1')
  setSVGStyle(svg, style)

  return svg
}
