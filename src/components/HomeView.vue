<template>
  <div>
    <!-- タイトル -->
    <img src="/img/title.png" class="w-full mb-4 animate-title" />
    <!-- キャラクター -->
    <img
      src="/img/avo_hello.png"
      class="w-2/3 mx-auto animate-entry delay-200 animate-float opacity-0"
    />

    <p class="my-4 text-lg opacity-0 animate-fadeIn delay-1000">
      アボカドが熟れているかどうかを<br />AIが画像から判定するよ
    </p>

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
    </div>

    <!-- <p>{{ preview }}</p> -->
    <div>
      <div v-if="preview" class="mb-4">
        <img :src="preview" class="rounded-xl w-full animate-fadeIn" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <button class="btn" @click="openCamera">📷 撮影する</button>
      <button class="btn sub" @click="openFile">🖼 画像をえらぶ</button>
    </div>

    <input
      type="file"
      accept="image/*"
      capture="environment"
      ref="cameraInput"
      @change="onFileChange"
      hidden
    />
    <input type="file" accept="image/*" ref="fileInput" @change="onFileChange" hidden />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])
const preview = ref(null)
const cameraInput = ref(null)
const fileInput = ref(null)

const openCamera = () => cameraInput.value.click()
const openFile = () => fileInput.value.click()

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  preview.value = URL.createObjectURL(file)
  emit('start', file)
}
</script>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}
</style>
