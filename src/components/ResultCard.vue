<script setup>
defineProps({ result: Boolean, confidence: Number })
</script>

<template>
  <div :class="['card', result ? 'ripe' : 'unripe']">
    <h2>{{ result ? '熟れてる！' : 'まだ早い' }}</h2>
    <p>信頼度 {{ confidence }}</p>
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  border-radius: 24px;
  font-size: 24px;
  background: white;
}

.pop-enter-active {
  animation: pop 0.5s;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
  }
}

.unripe {
  animation: shake 0.4s;
}

@keyframes shake {
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}
</style>
