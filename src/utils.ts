export const getFrameDuration = (el: HTMLElement): number =>
  parseInt(el.dataset.duration ?? el.id.match(/duration-(\d*)/)?.[1])

export const shouldIgnoreFrame = (el: HTMLElement) =>
  el.hasAttribute('data-ignore') || el.id.startsWith('ignore')

export const setSVGStyle = (svg: SVGElement, style: string) => {
  let styleSheet = svg.querySelector('style')
  if (!styleSheet) {
    styleSheet = document.createElement('style')
    svg.prepend(styleSheet)
  }
  styleSheet.textContent = style
}
