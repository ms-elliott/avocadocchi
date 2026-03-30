<template>
  <div class="score-section">
    <div class="score-header">
      <span class="score-title">AI信頼度</span>
      <span class="score-num">{{ displayScore }}<small>%</small></span>
    </div>
    <div class="score-track">
      <div
        class="score-fill"
        :class="isRipe ? 'fill-ripe' : 'fill-unripe'"
        :style="{ width: barWidth }"
      ></div>
      <div
        class="score-glow"
        :class="isRipe ? 'fill-ripe' : 'fill-unripe'"
        :style="{ width: barWidth }"
      ></div>
    </div>
    <div class="score-labels"><span>未熟</span><span>食べごろ</span></div>
  </div>
</template>

<script>
const ANIMATION_DURATION = 1200 // ミリ秒

export default {
  name: 'ScoreBar',

  props: {
    score: { type: Number, default: 0 }, // 生スコア 0.0〜1.0
    isRipe: { type: Boolean, default: false },
  },

  data() {
    return { animatedScore: 0 }
  },

  computed: {
    // 表示用スコア（isRipeに応じて反転）
    targetScore() {
      return this.isRipe ? this.score : 1 - this.score
    },
    displayScore() {
      return Math.round(this.animatedScore * 100)
    },
    barWidth() {
      return `${Math.round(this.animatedScore * 100)}%`
    },
  },

  watch: {
    score: {
      immediate: true,
      handler() {
        this.animateBar()
      },
    },
  },

  methods: {
    animateBar() {
      this.animatedScore = 0
      const target = this.targetScore
      const start = performance.now()

      const tick = (now) => {
        const t = Math.min((now - start) / ANIMATION_DURATION, 1)
        // イーズアウトキュービック
        this.animatedScore = (1 - Math.pow(1 - t, 3)) * target
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
  },
}
</script>

<style scoped>
.score-section {
  width: 100%;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.score-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: #6b7280;
}
.score-num {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: #1a1a2e;
}
.score-num small {
  font-size: 1rem;
}

.score-track {
  position: relative;
  width: 100%;
  height: 16px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  overflow: hidden;
}
.score-fill,
.score-glow {
  position: absolute;
  height: 100%;
  border-radius: 100px;
  transition: width 0.1s linear;
}
.score-glow {
  filter: blur(6px);
  opacity: 0.5;
}

.fill-ripe {
  background: linear-gradient(90deg, #34d399, #059669);
}
.fill-unripe {
  background: linear-gradient(90deg, #fde047, #eab308);
}

.score-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 700;
  margin-top: 4px;
}
</style>
