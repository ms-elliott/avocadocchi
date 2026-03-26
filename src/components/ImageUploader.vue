<script setup>
const emit = defineEmits(['selected'])

const handleFile = (e) => {
  const file = e.target.files[0]
  emit('selected', file)
}
</script>

<template>
  <div class="uploader">
    <input type="file" accept="image/*" @change="handleFile" />
  </div>
</template>

<style scoped>
input {
  margin-top: 20px;
}
</style>
