<script setup>
import { ref } from 'vue'

const emit = defineEmits(['predict'])

const preview = ref(null)
const file = ref(null)
const loading = ref(false)

const handleFile = (e) => {
  file.value = e.target.files[0]

  if (file.value) {
    preview.value = URL.createObjectURL(file.value)
  }
}

const handlePredict = async () => {
  loading.value = true

  await new Promise((r) => setTimeout(r, 1200))

  emit('predict', file.value)
}
</script>

<template>
  <div class="uploader">
    <!-- 画像未選択 -->
    <div v-if="!preview" class="select">
      <input type="file" accept="image/*" @change="handleFile" />
    </div>

    <!-- プレビュー -->
    <transition name="fade">
      <div v-if="preview" class="preview">
        <img :src="preview" style="width: 200px" />
        <button class="predict-btn" @click="handlePredict">判定する</button>
      </div>
    </transition>

    <!-- ローディング -->
    <transition name="fade">
      <div v-if="loading" class="loading">
        <div class="avocado">🥑</div>
        <p>判定中...</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}

.predict-btn {
  margin-top: 12px;
  padding: 12px;
  width: 100%;
  border-radius: 16px;
  background: #66bb6a;
  color: white;
}

/* アボカドアニメーション */
.avocado {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
