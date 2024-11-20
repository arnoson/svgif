import loopStyle from '@/assets/svgif-loop.css?raw'
import oneShotStyle from '@/assets/svgif-one-shot.css?raw'
import { downloadFile } from '@/utils/file'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { effect, markRaw, ref, shallowRef } from 'vue'

const createFrameAnimation = (
  frameDuration: number,
  animationDuration: number
) => `@keyframes svgif-frame-${frameDuration}-ms {
  0%,
  ${(frameDuration / animationDuration) * 100}% {
    visibility: visible;
  }
  ${(frameDuration / animationDuration) * 100}%,
  100% {
    visibility: hidden;
  }
}`

export type Frame = {
  el: SVGElement
  enabled: boolean
  previewEl: SVGSVGElement
  duration?: number
}

export const useEditor = defineStore('editor', () => {
  const parser = new DOMParser()

  const svg = shallowRef<SVGElement>()
  const frames = ref<Frame[]>([])
  const styleSheet = shallowRef<SVGStyleElement>()
  const style = ref('')

  const frameDuration = ref(100) // ms
  const loop = ref(true)
  const state = ref<'playing' | 'paused' | 'finished'>('finished')

  effect(() => {
    const uniqueFrameDurations = new Set<number>()
    let animationDuration = 0
    let defaultDuration = frameDuration.value

    let lastEnabledFrame: Frame | undefined
    for (const frame of frames.value) {
      // Mark disabled frames with a data attribute so we can reconstruct it
      // again when loading the file.
      frame.el.toggleAttribute('data-svgif-disabled', !frame.enabled)
      frame.el.classList.toggle('svgif-frame', frame.enabled)
      frame.el.classList.remove('svgif-last-frame')
      if (!frame.enabled) continue

      // Store the custom frame duration with a data attribute so we can
      // reconstruct it again when loading the file.
      if (frame.duration) frame.el.dataset.svgifDuration = `${frame.duration}`
      else frame.el.dataset.svgifDuration = undefined

      const frameStart = animationDuration
      const duration = frame.duration || defaultDuration

      animationDuration += duration
      uniqueFrameDurations.add(duration)

      frame.el.style.setProperty('--delay', `${frameStart}ms`)
      frame.el.style.setProperty('--animation', `svgif-frame-${duration}-ms`)

      lastEnabledFrame = frame
    }
    lastEnabledFrame?.el.classList.add('svgif-last-frame')
    console.log({ lastEnabledFrame })

    const frameAnimations = Array.from(uniqueFrameDurations)
      .map((duration) => createFrameAnimation(duration, animationDuration))
      .join('\n')

    svg.value?.style.setProperty(
      '--animation-duration',
      `${animationDuration}ms`
    )
    svg.value?.style.setProperty(
      '--animation-iteration-count',
      loop.value ? 'Infinite' : '1'
    )

    const baseStyle = loop.value ? loopStyle : oneShotStyle
    style.value = `${baseStyle}\n${frameAnimations}`
  })

  effect(() => styleSheet.value && (styleSheet.value.textContent = style.value))
  effect(() => svg.value?.setAttribute('data-svgif-state', state.value))
  // Store loop as a data attribute so we can reconstruct it again when loading
  // the file.
  effect(() => svg.value?.toggleAttribute('data-svgif-loop', loop.value))

  const load = (code: string) => {
    const doc = parser.parseFromString(code, 'image/svg+xml')
    const el = doc.documentElement
    if (!(el instanceof SVGElement))
      throw new Error('Please upload a valid SVG file')

    // Prepare the svg and frames.
    svg.value = el
    el.classList.add('svgif')
    loop.value = el.hasAttribute('data-svgif-loop')

    // Cleanup.
    el.querySelector('style[data-svgif-style]')?.remove()
    el.querySelectorAll('.svgif-frame').forEach((el) =>
      el.classList.remove('svgif-frame')
    )

    const isNonRendering = (el: Element) =>
      ['style', 'defs', 'title', 'desc'].includes(el.tagName)

    // Create an empty version of the svg that we'll use to preview each frame
    // individually.
    const emptySvg = el.cloneNode() as SVGElement
    emptySvg.append(...Array.from(el.children).filter(isNonRendering))

    const frameEls = Array.from(el.children).filter(
      (el) => !isNonRendering(el)
    ) as SVGElement[]

    frames.value = frameEls.map((el, index) => {
      const previewEl = emptySvg.cloneNode(true) as SVGSVGElement
      previewEl.classList.add('svgif-frame-preview')
      previewEl.append(el.cloneNode(true))

      const enabled = !el.hasAttribute('data-svgif-disabled')
      el.classList.toggle('svgif-frame', enabled)

      const durationAttr = el.dataset.svgifDuration
      const duration = durationAttr ? +durationAttr : undefined

      return {
        el: markRaw(el),
        previewEl: markRaw(previewEl),
        enabled,
        duration,
      }
    })

    frames.value.at(0)?.el.addEventListener('animationend', () => {
      state.value = 'finished'
    })

    frames.value.at(0)?.el.addEventListener('animationstart', () => {
      state.value = 'playing'
    })

    // This stylesheet will hold all svgif related css.
    styleSheet.value = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'style'
    )

    styleSheet.value.toggleAttribute('data-svgif-style', true)
    el.prepend(styleSheet.value)
  }

  const save = () => {
    let code = svg.value?.outerHTML
    if (!code) return
    downloadFile('test', code)
  }

  return { svg, frames, frameDuration, loop, load, save, style, state }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEditor, import.meta.hot))
