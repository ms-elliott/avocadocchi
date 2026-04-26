<template>
  <div>
    <!-- アップロード -->
    <div v-if="status === 'idle'" key="idle">
      <img src="/img/title.png" class="w-full mb-4 animate-title" />
      <MascotHello />
      <ImageUploader v-model="image" @predict="handlePredict" :status="status" />
    </div>
    <!-- ローディング -->
    <div v-else-if="status === 'loading'" key="loading">
      <LoadingView />
    </div>
    <!-- 結果 -->
    <div v-else-if="status === 'result'" key="result">
      <ResultView :result="result" :image="image" @retry="reset" />
    </div>
    <div v-else key="error">
      <ErrorView :message="errorMessage" @retry="reset" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MascotHello from './MascotHello.vue'
import ImageUploader from './ImageUploader.vue'
import LoadingView from './LoadingView.vue'
import ResultView from './ResultView.vue'
import ErrorView from './ErrorView.vue'

const status = ref('idle')
const image = ref(null)
const result = ref(null)
const errorMessage = ref('')

// アップロード
function handleImageUpdate(val) {
  image.value = val
}

// 判定開始
async function handlePredict() {
  status.value = 'loading'
  errorMessage.value = ''

  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      body: JSON.stringify({ image }),
    })

    const data = await res.json()
    result.value = data.result

    // 疑似API（あとで本物に差し替えOK）
    // await new Promise((r, reject) =>
    //   setTimeout(() => {
    //     // ランダムで失敗させる（テスト用）
    //     Math.random() > 0.7 ? reject('判定失敗！') : r()
    //   }, 1500),
    // )

    // result.value = '良いアボカド🥑'
    status.value = 'result'
  } catch (e) {
    errorMessage.value = e
    status.value = 'error'
  }
}

// リセット
function reset() {
  status.value = 'idle'
  image.value = null
  result.value = null
  errorMessage.value = ''
}
</script>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}
</style>
