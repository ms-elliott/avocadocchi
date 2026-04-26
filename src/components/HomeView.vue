<template>
  <div>
    <!-- タイトル -->
    <img src="/img/title.png" class="w-full mb-4 animate-title" />
    <!-- キャラクター -->
    <div v-if="!isLoading" key="uploader">
      <MascotHello />
      <ImageUploader @startLoading="startLoading" />
    </div>
    <div v-else key="loading">
      <LoadingView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageUploader from './ImageUploader.vue'
import MascotHello from './MascotHello.vue'
import LoadingView from './LoadingView.vue'

const isLoading = ref(false)

function startLoading() {
  isLoading.value = true
}
</script>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}
</style>
