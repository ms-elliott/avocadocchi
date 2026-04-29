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
import { onMounted, ref } from 'vue'
import * as tf from '@tensorflow/tfjs'
import MascotHello from './MascotHello.vue'
import ImageUploader from './ImageUploader.vue'
import LoadingView from './LoadingView.vue'
import ResultView from './ResultView.vue'
import ErrorView from './ErrorView.vue'

const status = ref('idle')
const image = ref(null)
const result = ref(null)
const errorMessage = ref('')

let model = null

// モデルロード
onMounted(async () => {
  try {
    await tf.setBackend('webgl')
    model = await tf.loadGraphModel('/model/model.json')
    console.log('model loaded')
  } catch (e) {
    console.error(e)
  }
})

// 前処理
function preprocess(img) {
  return tf.tidy(() => {
    return tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([100, 100])
      .toFloat()
      .div(255)
      .expandDims()
  })
}

// 判定開始
async function handlePredict() {
  status.value = 'loading'

  try {
    if (!image.value) throw new Error('画像がありません')

    const imgEl = await loadImage(image.value)
    const tensor = preprocess(imgEl)

    const pred = model.execute(tensor)

    // ✅ 出力を確認しながら処理
    let data
    if (Array.isArray(pred)) {
      // 複数出力の場合は最後のテンソルを使う
      data = await pred[pred.length - 1].data()
    } else {
      data = await pred.data()
    }

    console.log('raw data:', data)
    console.log('length:', data.length)

    // ✅ 2クラス分類として処理
    // data[0] = unripe(未熟), data[1] = ripe(完熟)
    const unripeScore = data[data.length - 2]
    const ripeScore = data[data.length - 1]

    console.log('unripe:', unripeScore, 'ripe:', ripeScore)

    result.value = ripeScore > unripeScore ? 'ripe' : 'notyet'
    status.value = 'result'
  } catch (e) {
    errorMessage.value = e.message
    status.value = 'error'
  }
}

// 画像ロード完了を待つ
function loadImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        reject(new Error('画像サイズが不正です'))
      } else {
        resolve(img)
      }
    }

    img.onerror = reject
  })
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
