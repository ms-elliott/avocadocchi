<script setup>
import { ref, onMounted } from 'vue'
import { loadModel, predict } from '../composables/useClassifier'

const image = ref(null)
const result = ref('')

onMounted(async () => {
  await loadModel()
})

const handleChange = (e) => {
  const file = e.target.files[0]
  const img = new Image()
  img.src = URL.createObjectURL(file)

  img.onload = async () => {
    image.value = img
    const pred = await predict(img)

    // 2クラス想定
    if (pred[0] > pred[1]) {
      result.value = '未熟 🥑'
    } else {
      result.value = '食べ頃 😋'
    }
  }
}
</script>

<template>
  <input type="file" @change="handleChange" />
  <p>{{ result }}</p>
</template>
