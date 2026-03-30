<template>
  <div class="screen result-screen">
    <!-- コンフェッティ（食べごろのときのみ） -->
    <div v-if="isRipe" class="confetti-wrap">
      <span v-for="c in confetti" :key="c.id" class="confetti-piece" :style="c.style">{{
        c.icon
      }}</span>
    </div>

    <!-- マスコット -->
    <div class="result-mascot-wrap">
      <AvoMascot
        :mode="isRipe ? 'ripe' : 'unripe'"
        size="large"
        :class="isRipe ? 'happy' : 'sleepy'"
      />
      <div class="result-glow" :class="isRipe ? 'glow-green' : 'glow-yellow'"></div>
    </div>

    <!-- 判定ラベル -->
    <div class="result-label-wrap">
      <div class="result-tag" :class="isRipe ? 'tag-ripe' : 'tag-unripe'">
        {{ isRipe ? '🥑 食べごろ！' : '🌱 まだ早い' }}
      </div>
      <p class="result-desc">
        {{
          isRipe ? '今すぐ食べましょう！最高の状態です✨' : 'もう少し待って。1〜2日で食べごろに！'
        }}
      </p>
    </div>

    <!-- 信頼度スコアバー -->
    <ScoreBar :score="score" :is-ripe="isRipe" />

    <!-- 豆知識 -->
    <TriviaCard :text="trivia" />

    <!-- もう一度ボタン -->
    <button class="retry-btn" @click="$emit('retry')"><span>🔄</span> もう一度判定する</button>

    <TechBadge />
  </div>
</template>

<script>
import AvoMascot from '../components/AvoMascot.vue'
import ScoreBar from '../components/ScoreBar.vue'
import TriviaCard from '../components/TriviaCard.vue'
import TechBadge from '../components/TechBadge.vue'

// コンフェッティの設定
const CONFETTI_ICONS = ['🥑', '✨', '🎉', '⭐', '🌟', '💛', '💚']
const CONFETTI_COUNT = 20

export default {
  name: 'ResultScreen',
  components: { AvoMascot, ScoreBar, TriviaCard, TechBadge },
  emits: ['retry'],

  props: {
    score: { type: Number, default: 0 },
    isRipe: { type: Boolean, default: false },
    trivia: { type: String, default: '' },
  },

  data() {
    return { confetti: [] }
  },

  mounted() {
    if (this.isRipe) this.generateConfetti()
  },

  methods: {
    generateConfetti() {
      this.confetti = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        icon: CONFETTI_ICONS[i % CONFETTI_ICONS.length],
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${1.5 + Math.random() * 1.5}s`,
          fontSize: `${1 + Math.random() * 1.2}rem`,
        },
      }))
    },
  },
}
</script>

<style scoped>
.screen {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.2rem 3rem;
  gap: 1.2rem;
  max-width: 440px;
  margin: 0 auto;
  position: relative;
}

/* コンフェッティ */
.confetti-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 100;
}
.confetti-piece {
  position: absolute;
  top: -2rem;
  animation: confettiFall linear forwards;
}
@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* マスコット */
.result-mascot-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.happy {
  animation: happyWiggle 0.5s ease-in-out 3;
}
.sleepy :deep(.avo-body) {
  animation: sleepyBob 2s ease-in-out infinite;
}
@keyframes happyWiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(8deg);
  }
}
@keyframes sleepyBob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* マスコット背景グロー */
.result-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  z-index: -1;
  animation: glowPulse 2s ease-in-out infinite;
}
.glow-green {
  background: #52b788;
}
.glow-yellow {
  background: #f4d03f;
}
@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

/* 判定ラベル */
.result-label-wrap {
  text-align: center;
}
.result-tag {
  display: inline-block;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  padding: 8px 28px;
  border-radius: 100px;
  margin-bottom: 8px;
  animation: tagPop 0.5s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
@keyframes tagPop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.tag-ripe {
  background: #d1fae5;
  color: #065f46;
  box-shadow: 0 4px 0 #6ee7b7;
}
.tag-unripe {
  background: #fef9c3;
  color: #854d0e;
  box-shadow: 0 4px 0 #fde047;
}
.result-desc {
  font-size: 0.88rem;
  color: #4b5563;
  font-weight: 700;
}

/* もう一度ボタン */
.retry-btn {
  width: 100%;
  padding: 0.9rem;
  border-radius: 100px;
  border: 3px solid #52b788;
  background: #fff;
  color: #2d6a4f;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.retry-btn:hover {
  background: #f0fdf4;
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(82, 183, 136, 0.25);
}
</style>
