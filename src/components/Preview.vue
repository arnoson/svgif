<script setup lang="ts">
import { useEditor } from '@/stores/editor'
import { useTemplateRef, watch } from 'vue'

const editor = useEditor()

const el = useTemplateRef('el')

const updateSvg = () => {
  if (!editor.svg) return
  el.value?.replaceChildren()
  el.value?.append(editor.svg)
}

watch(() => editor.svg, updateSvg)
watch(() => editor.style, updateSvg)
watch(
  () => editor.state,
  (state, oldState) => {
    if (!editor.loop && state === 'playing' && oldState === 'finished') {
      updateSvg()
    }
  }
)
</script>

<template>
  <div ref="el" class="preview"></div>
</template>

<style scoped>
.preview {
  height: 100%;
  padding: 1rem;
}
</style>

<style>
/* We have to use a global style for this, since we are appending the svg
manually */
.preview svg {
  width: 100%;
  height: 100%;
}
</style>
