<script setup lang="ts">
import { useEditor } from '@/stores/editor'
import CheckboxField from './CheckboxField.vue'
import NumberField from './NumberField.vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'

const editor = useEditor()

const togglePlayback = () => {
  editor.state = editor.state === 'playing' ? 'paused' : 'playing'
}
</script>

<template>
  <div class="transport-bar panel">
    <button
      @click="togglePlayback()"
      :aria-pressed="editor.state === 'playing'"
      aria-label="play/pause"
    >
      <PauseIcon v-if="editor.state === 'playing'" />
      <PlayIcon v-else />
    </button>
    <CheckboxField label="Loop" v-model="editor.loop" data-layout="inline" />
    <NumberField
      label="Frame"
      unit="ms"
      v-model="editor.frameDuration"
      data-layout="inline"
    />
  </div>
</template>

<style scoped>
.transport-bar {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  translate: -50%;

  button {
    width: 1rem;
    height: 1rem;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
