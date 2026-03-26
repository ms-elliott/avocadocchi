<script setup>
import { ref, watch } from 'vue'
import ResultCard from '../components/ResultCard.vue'

const props = defineProps({ result: Boolean })
const emit = defineEmits(['retry'])

const showResult = ref(false)
const showComment = ref(false)
const showTip = ref(false)
const tip = ref('')

const tips = ['りんごと一緒に置いておくと熟成UP!', '表面はデコボコよりツルツルがおすすめ！']

watch(
  () => props.result,
  () => {
    setTimeout(() => (showResult.value = true), 200)
    setTimeout(() => (showComment.value = true), 800)
    setTimeout(() => {
      tip.value = tips[Math.floor(Math.random() * tips.length)]
      showTip.value = true
    }, 1400)
  },
)
</script>

<template>
  <div class="result">
    <transition name="pop">
      <ResultCard v-if="showResult" :result="result" />
    </transition>
    <button @click="emit('retry')">もう一度</button>
  </div>
</template>
