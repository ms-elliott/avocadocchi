<template>
  <div class="loading-wrap">
    <!-- マスコット -->
    <div class="mascot-wrap">
      <img src="/img/avo_thinking.png" class="mascot-img animate-thinking" />
      <div class="mascot-shadow"></div>
    </div>

    <!-- テキスト -->
    <p class="loading-title">うーん…判定中</p>

    <!-- ドットローダー -->
    <div class="dot-loader">
      <span class="dot" style="animation-delay: 0s"></span>
      <span class="dot" style="animation-delay: 0.2s"></span>
      <span class="dot" style="animation-delay: 0.4s"></span>
    </div>

    <!-- プログレスバー -->
    <div class="progress-wrap">
      <div class="progress-bar"></div>
    </div>

    <p class="loading-sub">AIがアボカドを分析しています...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dots = ref('.')

onMounted(() => {
  setInterval(() => {
    dots.value = dots.value.length >= 3 ? '.' : dots.value + '.'
  }, 500)
})
</script>

<style scoped>
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 12px;
}

/* マスコット */
.mascot-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mascot-img {
  width: 60%;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
  animation: thinking 1.2s ease-in-out infinite;
}

@keyframes thinking {
  0% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(-4deg);
  }
}

.mascot-shadow {
  width: 45%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  margin-top: -8px;
  animation: shadowThinking 1.2s ease-in-out infinite;
}

@keyframes shadowThinking {
  0% {
    transform: scaleX(1);
    opacity: 0.15;
  }
  50% {
    transform: scaleX(0.85);
    opacity: 0.1;
  }
  100% {
    transform: scaleX(1);
    opacity: 0.15;
  }
}

/* テキスト */
.loading-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #374151;
}

.loading-sub {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 700;
}

/* ドットローダー */
.dot-loader {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #86efac;
  animation: dotBounce 0.8s ease-in-out infinite;
}

@keyframes dotBounce {
  0%,
  100% {
    transform: translateY(0);
    background: #86efac;
  }
  50% {
    transform: translateY(-10px);
    background: #4ade80;
  }
}

/* プログレスバー */
.progress-wrap {
  width: 70%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #86efac, #4ade80);
  animation: progress 2.5s ease-in-out forwards;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  60% {
    width: 80%;
  }
  90% {
    width: 90%;
  }
  100% {
    width: 98%;
  }
}
</style>
