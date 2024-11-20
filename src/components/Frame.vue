<script setup lang="ts">
import { useEditor, type Frame } from '@/stores/editor'
import { effect, useTemplateRef } from 'vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import CheckboxField from './CheckboxField.vue'

const props = defineProps<{ frame: Frame }>()
const el = useTemplateRef('el')

const editor = useEditor()

effect(() => {
  el.value?.querySelector('svg.svgif-frame-preview')?.remove()
  el.value?.prepend(props.frame.previewEl)
})
</script>

<template>
  <div ref="el" class="frame" :data-enabled="frame.enabled">
    <div class="header">
      <input
        class="duration"
        type="number"
        v-model="frame.duration"
        :placeholder="`${editor.frameDuration}`"
      />
      <input type="checkbox" class="enabled" v-model="frame.enabled" />
    </div>
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  height: 100%;
  width: max-content; /* needed in firefox */
  border: 1px solid var(--color-guide);
  background-color: var(--color-panel-background);
  border-radius: 0.5rem;
  transition: background-color 100ms;

  &[data-enabled='false'] {
    background-color: var(--color-background);
  }
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  gap: 0.5rem;
}

.duration {
  background-color: var(--color-text);
  color: var(--color-background);
  border: 1px solid var(--color-panel-background);
  field-sizing: content;
  transition: opacity 100ms;

  .frame[data-enabled='false'] & {
    opacity: 0;
  }

  &::placeholder {
    color: rgba(from currentColor r g b / 0.5);
  }
}

@media (hover: hover) {
  .enabled {
    transition: opacity 100ms;
    .frame:not(:hover) & {
      opacity: 0;
    }
  }
}
</style>

<style>
.frame .svgif-frame-preview {
  display: block;
  height: 100%;
  width: auto;
  transition: opacity 100ms;
}

.frame[data-enabled='false'] .svgif-frame-preview {
  opacity: 0.4;
}
</style>
