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
      アボカドが熟れているか<br />AIが画像から判定するよ
    </p>

    <ImageUploader />
  </div>
</template>

<script setup>
import ImageUploader from './ImageUploader.vue'
</script>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}
</style>
