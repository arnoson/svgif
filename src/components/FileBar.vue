<script setup lang="ts">
import { useEditor } from '@/stores/editor'
import FileUpload from './FileUpload.vue'

const editor = useEditor()
</script>

<template>
  <div class="file-bar">
    <FileUpload />
    <button @click="editor.save()">Save</button>
  </div>
</template>

<style scoped>
.file-bar {
  position: absolute;
  top: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
</style>
