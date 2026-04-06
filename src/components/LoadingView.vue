<template>
  <div>
    <p class="text-lg">うーん…判定中</p>
    <img src="/img/avo_thinking.png" class="w-2/3 mx-auto animate-thinking" />
    <p class="text-2xl animate-blink">{{ dots }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dots = ref('.')

onMounted(() => {
  setInterval(() => {
    dots.value = dots.value.length >= 3 ? '.' : dots.value + '.'
  }, 500)
})
</script>
