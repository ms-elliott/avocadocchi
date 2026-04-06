<template>
  <div class="max-w-sm mx-auto p-4 text-center">
    <HomeView v-if="state === 'home'" @start="handleStart" />
    <LoadingView v-if="state === 'loading'" />
    <ResultView v-if="state === 'result'" :result="result" @reset="reset" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeView from './components/HomeView.vue'
import LoadingView from './components/LoadingView.vue'
import ResultView from './components/ResultView.vue'

const state = ref('home')
const result = ref(null)

const handleStart = async () => {
  state.value = 'loading'

  setTimeout(() => {
    result.value = Math.random() > 0.5 ? 'ripe' : 'unripe'
    state.value = 'result'
  }, 2000)
}

const reset = () => {
  state.value = 'home'
  result.value = null
}
</script>
