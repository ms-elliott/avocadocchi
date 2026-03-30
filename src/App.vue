<template>
  <div class="app" :class="appClass">
    <!-- 背景パーティクル -->
    <div class="particles">
      <span v-for="p in particles" :key="p.id" class="particle" :style="p.style">{{ p.icon }}</span>
    </div>

    <!-- 画面遷移 -->
    <transition name="screen-slide" mode="out-in">
      <HomeScreen
        v-if="screen === 'home'"
        key="home"
        ref="homeScreen"
        :is-loading="isLoading"
        @predict="onPredict"
      />
      <ResultScreen
        v-else-if="screen === 'result'"
        key="result"
        :score="rawScore"
        :is-ripe="isRipe"
        :trivia="trivia"
        @retry="onRetry"
      />
    </transition>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import HomeScreen from './views/HomeView.vue'
import ResultScreen from './views/ResultView.vue'
import { TRIVIA_LIST, pickRandom } from './constants/constants.js'

// パーティクルの設定
const PARTICLE_ICONS = ['🥑', '🌿', '✨', '💚', '🌱']
const PARTICLE_COUNT = 8

export default {
  name: 'App',
  components: { HomeScreen, ResultScreen },

  data() {
    return {
      screen: 'home', // 'home' | 'result'
      isModelReady: false,
      isLoading: false,
      rawScore: 0, // モデルの生スコア（0.0〜1.0）
      trivia: '',
      particles: [],
    }
  },

  computed: {
    isRipe() {
      return this.rawScore > 0.5
    },
    // 結果に応じて背景クラスを切り替え
    appClass() {
      if (this.screen !== 'result') return ''
      return this.isRipe ? 'result-ripe' : 'result-unripe'
    },
  },

  async mounted() {
    await this.loadModel()
    this.spawnParticles()
  },

  methods: {
    // ---------- モデル ----------
    async loadModel() {
      await tf.setBackend('cpu')
      await tf.ready()
      try {
        this._model = await tf.loadGraphModel('/tfjs_model/model.json')
        this.isModelReady = true
        console.log('✅ モデルロード完了')
      } catch (e) {
        console.error('❌ モデルロード失敗:', e)
      }
    },

    // ---------- 推論 ----------
    async onPredict(previewUrl) {
      if (!this._model || !previewUrl) return

      this.isLoading = true
      this.$refs.homeScreen?.setLoading(true)

      try {
        const tensor = await this.urlToTensor(previewUrl)
        const prediction = this._model.execute(tensor)
        const [score] = await prediction.data()

        tensor.dispose()
        prediction.dispose()

        this.rawScore = score
        this.trivia = pickRandom(TRIVIA_LIST)
        this.screen = 'result'
      } catch (e) {
        console.error('❌ 推論エラー:', e)
      } finally {
        this.isLoading = false
        this.$refs.homeScreen?.setLoading(false)
      }
    },

    // URLをTensorに変換する共通処理
    async urlToTensor(url) {
      const img = new Image()
      img.src = url
      await new Promise((resolve) => {
        img.onload = resolve
      })

      return tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([100, 100])
        .toFloat()
        .div(255.0)
        .expandDims()
    },

    // ---------- リトライ ----------
    onRetry() {
      this.screen = 'home'
      this.rawScore = 0
      this.trivia = ''
      this.$nextTick(() => {
        this.$refs.homeScreen?.resetPreview()
      })
    },

    // ---------- パーティクル ----------
    spawnParticles() {
      this.particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        icon: PARTICLE_ICONS[i % PARTICLE_ICONS.length],
        style: {
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          '--dur': `${6 + Math.random() * 6}s`,
          '--del': `${Math.random() * 5}s`,
          fontSize: `${0.8 + Math.random() * 0.8}rem`,
          opacity: 0.15 + Math.random() * 0.15,
        },
      }))
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100dvh;
  background: linear-gradient(160deg, #e8f5e9 0%, #fffde7 50%, #e8f5e9 100%);
  font-family: 'M PLUS Rounded 1c', sans-serif;
  overflow: hidden;
  transition: background 0.8s ease;
  position: relative;
}
.app.result-ripe {
  background: linear-gradient(160deg, #d4edda 0%, #f0fff4 50%, #c6f6d5 100%);
}
.app.result-unripe {
  background: linear-gradient(160deg, #fffde7 0%, #fef9c3 50%, #fffde7 100%);
}

/* パーティクル */
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  animation: floatParticle var(--dur, 8s) var(--del, 0s) ease-in-out infinite alternate;
}
@keyframes floatParticle {
  from {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  to {
    transform: translateY(-30px) rotate(15deg) scale(1.1);
  }
}

/* 画面遷移アニメーション */
.screen-slide-enter-active {
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.screen-slide-leave-active {
  animation: slideOut 0.3s ease-in forwards;
}
@keyframes slideIn {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-60px);
    opacity: 0;
  }
}
</style>
