<script setup>
// ===== インポート =====
import { onMounted, ref } from 'vue'
import * as tf from '@tensorflow/tfjs'
import { useModel } from '@/composables/useModel'
import MascotHello from './MascotHello.vue'
import ImageUploader from './ImageUploader.vue'
import LoadingView from './LoadingView.vue'
import ResultView from './ResultView.vue'
import ErrorView from './ErrorView.vue'

// ===== 状態管理 =====
const image = ref(null)
const status = ref('idle')
const result = ref(null)
const score = ref(null)
const errorMessage = ref('')

// ===== モデル =====
// useModel.jsでモデルのロード・取得を管理
const { loadModel, getModel } = useModel()
onMounted(() => loadModel())

// ===== 画像前処理 =====
// 画像をTensorFlowが推論できる形式に変換する
function preprocess(img) {
  return tf.browser
    .fromPixels(img)
    .resizeNearestNeighbor([100, 100]) // モデルの入力サイズに合わせてリサイズ
    .toFloat()
    .div(tf.scalar(255)) // 0〜1に正規化
    .expandDims(0) // バッチ次元を追加 [1, 100, 100, 3]
}

// ===== 画像ロード =====
// base64画像をHTMLImageElementに変換してロード完了を待つ
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

// ===== 判定処理 =====
async function handlePredict() {
  status.value = 'loading'

  try {
    if (!image.value) throw new Error('画像がありません')

    const model = getModel()
    if (!model) throw new Error('モデルが読み込まれていません')

    // 推論処理と最低2秒のローディング表示を並行実行
    const [imgEl] = await Promise.all([
      loadImage(image.value),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ])

    const tensor = preprocess(imgEl)
    const pred = model.execute(tensor)
    const output = Array.isArray(pred) ? pred[pred.length - 1] : pred
    const data = await output.data()

    tensor.dispose() // メモリリークを防ぐためテンソルを解放

    // data[0] = unripe(未熟), data[1] = ripe(完熟) のスコア
    const unripeScore = data[data.length - 2]
    const ripeScore = data[data.length - 1]

    result.value = ripeScore > unripeScore ? 'ripe' : 'notyet'
    score.value = Math.round((ripeScore > unripeScore ? ripeScore : unripeScore) * 100)
    status.value = 'result'
  } catch (e) {
    errorMessage.value = e.message
    status.value = 'error'
  }
}

// ===== リセット =====
function handleReset() {
  status.value = 'idle'
  image.value = null
  result.value = null
  score.value = null
  errorMessage.value = ''
}
</script>

<template>
  <div>
    <!-- アップロード画面 -->
    <div v-if="status === 'idle'">
      <img src="/img/title.png" class="w-full mb-4 animate-title" />
      <MascotHello />
      <ImageUploader v-model="image" @predict="handlePredict" :status="status" />
    </div>

    <!-- ローディング画面 -->
    <div v-else-if="status === 'loading'">
      <LoadingView />
    </div>

    <!-- 判定結果画面 -->
    <div v-else-if="status === 'result'">
      <ResultView :result="result" :image="image" :score="score" @retry="handleReset" />
    </div>

    <!-- エラー画面 -->
    <div v-else>
      <ErrorView :message="errorMessage" @retry="handleReset" />
    </div>
  </div>
</template>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}
</style>
