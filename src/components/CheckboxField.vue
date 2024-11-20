<script setup lang="ts">
import { getInputId } from '@/utils/id'

defineProps<{
  label: string
  unit?: string
  min?: number
  max?: number
  step?: number
}>()
const model = defineModel<boolean>({ required: true })
const id = getInputId()
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input type="checkbox" v-model="model" />
  </div>
</template>

<style scoped>
.input-unit {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  gap: 0.5rem;

  input {
    flex: 1;
  }
}
</style>
