<template>
  <transition name="trivia-in">
    <div v-if="text" class="trivia-card">
      <div class="trivia-header">
        <span class="trivia-icon">💡</span>
        <span class="trivia-title">アボカド豆知識</span>
      </div>
      <p class="trivia-text">{{ text }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TriviaCard',
  props: {
    text: { type: String, default: '' },
  },
}
</script>

<style scoped>
.trivia-card {
  width: 100%;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem 1.2rem;
  border: 2px solid #e9f5db;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}
.trivia-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.trivia-icon { font-size: 1.1rem; }
.trivia-title { font-size: 0.78rem; font-weight: 800; color: #52b788; letter-spacing: 0.5px; text-transform: uppercase; }
.trivia-text { font-size: 0.88rem; color: #374151; font-weight: 600; line-height: 1.6; }
.trivia-in-enter-active { animation: triviaSlide 0.5s 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes triviaSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
