<script setup lang="ts">
import { useEditor } from '@/stores/editor'
import Frame from './Frame.vue'

const editor = useEditor()
</script>

<template>
  <div class="frames">
    <Frame v-for="frame of editor.frames" :frame />
  </div>
</template>

<style scoped>
.frames {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow-x: scroll;
  overscroll-behavior-x: contain;
  padding: 1rem;
  gap: 0.6rem;
}
</style>
