<template>
  <div class="error-wrap">
    <!-- マスコット -->
    <div class="mascot-wrap">
      <img src="/img/avo_alart.png" class="mascot-img" />
      <div class="mascot-shadow"></div>
    </div>

    <!-- メッセージ -->
    <div class="error-card">
      <p class="error-title">あれれ…😵</p>
      <p class="error-message">{{ props.message }}</p>
    </div>

    <button class="btn btn-red" @click="emit('retry')">もう一度試す</button>
  </div>
</template>

<script setup>
const props = defineProps({ message: String })
const emit = defineEmits(['retry'])
</script>

<style scoped>
.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 16px;
}

/* マスコット */
.mascot-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mascot-img {
  width: 55%;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
  animation: sadShake 2s ease-in-out infinite;
}

@keyframes sadShake {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-3deg);
  }
  40% {
    transform: rotate(3deg);
  }
  60% {
    transform: rotate(-2deg);
  }
  80% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.mascot-shadow {
  width: 40%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  margin-top: -8px;
}

/* エラーカード */
.error-card {
  background: white;
  border: 2.5px solid #fca5a5;
  border-radius: 20px;
  padding: 16px 24px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.error-title {
  font-size: 1.1rem;
  font-weight: 900;
  color: #ef4444;
  margin-bottom: 8px;
}

.error-message {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  line-height: 1.6;
  word-break: break-all;
}

.retry-btn:active {
  transform: scale(0.97);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
}
</style>
