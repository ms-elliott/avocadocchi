<script setup>
import { ref } from 'vue'
import Home from './views/HomePage.vue'
import ResultView from './views/ResultView.vue'

const result = ref(null)

const handleResult = (res) => {
  result.value = res
}

const reset = () => {
  result.value = null
}
</script>

<template>
  <div class="app">
    <Home v-if="result === null" @predicted="handleResult" />
    <ResultView v-else :result="result" @retry="reset" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: #f1f8e9;
}
</style>
