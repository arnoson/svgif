<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import { onMounted, onUnmounted } from 'vue'
import FileBar from './components/FileBar.vue'
import Frames from './components/Frames.vue'
import Preview from './components/Preview.vue'
import TransportBar from './components/TransportBar.vue'
import { useEditor } from './stores/editor'

const editor = useEditor()

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('beforeunload', onBeforeUnload)
})

const onKeyDown = ({ code, target }: KeyboardEvent) => {
  if (code !== 'Space' || target !== document.body) return
  editor.state = editor.state === 'playing' ? 'paused' : 'playing'
}

const onBeforeUnload = (e: Event) => {
  e.preventDefault()
}
</script>

<template>
  <SplitterGroup direction="vertical">
    <SplitterPanel id="panel-top">
      <Preview />
      <TransportBar />
      <FileBar />
    </SplitterPanel>

    <SplitterResizeHandle id="panel-top:panel-bottom" class="resize-handle" />

    <SplitterPanel id="panel-bottom" :default-size="20">
      <Frames />
    </SplitterPanel>
  </SplitterGroup>
</template>

<style>
.resize-handle {
  --size: 5px;
  --margin: 1rem;

  transition: opacity 200ms;

  &[data-state='inactive']:not(:focus) {
    opacity: 0.1;
  }

  background: var(--color-panel-background);
  border-radius: var(--size);

  &[data-orientation='vertical'] {
    height: var(--size);
    margin-inline: var(--margin);
  }

  &[data-orientation='horizontal'] {
    width: var(--size);
    margin-block: var(--margin);
  }
}

#panel-top {
  position: relative;
}
</style>
