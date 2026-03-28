<script setup>
import ImageUploader from '../components/ImageUploader.vue'
import { useClassifier } from '../composables/useClassifier'

const emit = defineEmits(['predicted'])
const { predict } = useClassifier()

const handlePredict = async (file) => {
  const result = await predict(file)
  emit('predicted', result)
}
</script>

<template>
  <div class="home">
    <div class="logo">🥑</div>
    <h1>アボカドっち</h1>

    <ImageUploader @predict="handlePredict" />
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 24px;
}

.logo {
  font-size: 64px;
  animation: float 3s infinite;
}

@keyframes float {
  50% {
    transform: translateY(-8px);
  }
}

.loading {
  margin-top: 16px;
}
</style>
