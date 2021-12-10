# 💫 SVGIF

Animate SVG layers like gifs!

## Installation

```
npm i svgif
```

## Usage

`svgif` treats all direct children of `<svg>` as the frames for the animation and will show one after the other.

```html
<svg id="my-svg">
  <rect width="100" height="100" fill="red" />
  <rect width="100" height="100" fill="green" />
  <rect width="100" height="100" fill="blue" />
</svg>
```

```js
import svgif from 'svgif'
import 'svgif/dist/index.css'
svgif(document.querySelector('#my-svg'))
```

## API

```ts
svgif(svg: SVGElement, {
  frameDuration = 500, // Duration for each frame. Can be overwritten for individual frames (see: #Tweak SVG).
  loop = true // Wether or not to loop the animation.
  clone = false // If enabled, the input svg will not be mutated and a copy is returned instead.
}): SVGElement
```

## Tweak SVG

You can tweak the animation directly within the SVG. All options that are specified via an `data-` attribute can also be set via the element's id. This makes it easy to fine tune the animation inside a graphic software where you usually can only change the name (id) of a layer.

```html
<!-- These two are the same: -->
<rect data-duration="2000" />
<rect id="duration-2000" />
<!-- It even works if your graphic software adds a suffix to the id during export. -->
<rect id="duration-2000_2" />
```

### Frame Duration

```html
<!-- ... other frames ... -->
<rect width="100" height="100" fill="blue" data-duration="2000" />
```

### Ignore Frame

```html
<!-- ... other frames ... -->
<rect width="100" height="100" fill="blue" data-ignore />
```
