<script>
import AvoMascot from '../components/AvoMascot.vue'
import UploadZone from '../components/UploadZone.vue'
import TechBadge from '../components/TechBadge.vue'
import { MASCOT_MESSAGES, pickRandom } from '../constants/constants.js'

// まばたきの間隔（ミリ秒）
const BLINK_INTERVAL_MIN = 2500
const BLINK_INTERVAL_RANGE = 2000
const BLINK_DURATION = 150

// マスコットのアニメーション時間（ミリ秒）
const MASCOT_WAVE_DURATION = 1000
const MASCOT_MESSAGE_DURATION = 2500

export default {
  name: 'HomeScreen',
  components: { AvoMascot, UploadZone, TechBadge },
  emits: ['predict'],

  props: {
    isLoading: { type: Boolean, default: false },
  },

  data() {
    return {
      previewUrl: null,
      titleAnimated: false,
      isBlinking: false,
      isTalking: false,
      isWaving: false,
      mascotMessage: '',
    }
  },

  mounted() {
    // 入場アニメーション
    setTimeout(() => {
      this.titleAnimated = true
    }, 100)

    // まばたきループ開始
    this.blinkLoop()

    // 起動時の挨拶
    this.showMascotMessage('よろしくね〜！🥑', { wave: true })
  },

  methods: {
    // マスコットをタップしたときのランダムセリフ
    onMascotTalk() {
      this.showMascotMessage(pickRandom(MASCOT_MESSAGES), { wave: true, talk: true })
    },

    // セリフ表示の共通メソッド
    showMascotMessage(message, { wave = false, talk = false } = {}) {
      this.mascotMessage = message
      if (wave) this.isWaving = true
      if (talk) this.isTalking = true

      setTimeout(() => {
        this.isWaving = false
        this.isTalking = false
      }, MASCOT_WAVE_DURATION)

      setTimeout(() => {
        this.mascotMessage = ''
      }, MASCOT_MESSAGE_DURATION)
    },

    // まばたきを一定間隔でループ
    blinkLoop() {
      const schedule = () => {
        const delay = BLINK_INTERVAL_MIN + Math.random() * BLINK_INTERVAL_RANGE
        setTimeout(() => {
          this.isBlinking = true
          setTimeout(() => {
            this.isBlinking = false
          }, BLINK_DURATION)
          schedule()
        }, delay)
      }
      schedule()
    },

    // 親(App.vue)から呼ばれるメソッド：ローディング状態を反映
    setLoading(val) {
      this.isTalking = val
      this.mascotMessage = val ? '解析中…🔬' : ''
    },

    // 親(App.vue)から呼ばれるメソッド：プレビューをリセット
    resetPreview() {
      this.previewUrl = null
    },
  },
}
</script>

<template>
  <div class="screen home-screen">
    <!-- タイトルエリア（入場アニメーション付き） -->
    <div class="title-area" :class="{ animated: titleAnimated }">
      <AvoMascot
        mode="home"
        :is-blinking="isBlinking"
        :is-talking="isTalking"
        :is-waving="isWaving"
        :message="mascotMessage"
        @talk="onMascotTalk"
      />
      <h1 class="app-title">
        <span class="title-avo">アボカ</span>
        <span class="title-dotti">どっち</span>
        <span class="title-mark">!?</span>
      </h1>
      <p class="app-catch">熟れてる？まだ？<br />写真を撮ってAIに聞いてみよう！</p>
    </div>

    <!-- 画像アップロード -->
    <UploadZone v-model="previewUrl" />

    <!-- 判定ボタン -->
    <button
      class="judge-btn"
      :class="{ ready: !!previewUrl, loading: isLoading }"
      :disabled="!previewUrl || isLoading"
      @click="$emit('predict', previewUrl)"
    >
      <transition name="btn-text" mode="out-in">
        <span v-if="isLoading" key="loading" class="btn-loading">
          <span class="dot-bounce" style="--d: 0s">●</span>
          <span class="dot-bounce" style="--d: 0.15s">●</span>
          <span class="dot-bounce" style="--d: 0.3s">●</span>
        </span>
        <span v-else key="idle" class="btn-label"> <span>🔍</span> 判定する！ </span>
      </transition>
    </button>

    <TechBadge />
  </div>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1.2rem 3rem;
  gap: 1.2rem;
  max-width: 440px;
  margin: 0 auto;
}

/* タイトルエリア：入場アニメーション */
.title-area {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
  width: 100%;
}
.title-area.animated {
  opacity: 1;
  transform: translateY(0);
}

.app-title {
  font-family: 'Zen Maru Gothic', sans-serif;
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0.5rem 0 6px;
}
.title-avo {
  color: #2d6a4f;
}
.title-dotti {
  color: #f4a261;
  text-shadow: 3px 3px 0 #f4d03f;
}
.title-mark {
  color: #f4d03f;
  font-size: 2rem;
  display: inline-block;
  animation: markBounce 1s ease-in-out infinite;
}
@keyframes markBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.app-catch {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 700;
  line-height: 1.6;
}

/* 判定ボタン */
.judge-btn {
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 100px;
  border: none;
  background: #ccc;
  color: #fff;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: not-allowed;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}
.judge-btn.ready {
  background: linear-gradient(135deg, #52b788, #2d6a4f);
  cursor: pointer;
  box-shadow:
    0 6px 0 #1b4332,
    0 8px 20px rgba(45, 106, 79, 0.35);
}
.judge-btn.ready:hover {
  transform: translateY(-3px);
  box-shadow:
    0 9px 0 #1b4332,
    0 12px 28px rgba(45, 106, 79, 0.4);
}
.judge-btn.ready:active {
  transform: translateY(2px);
  box-shadow: 0 3px 0 #1b4332;
}
.judge-btn.loading {
  background: linear-gradient(135deg, #f4a261, #e76f51);
  cursor: wait;
  box-shadow: 0 6px 0 #c05b3a;
}

.btn-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.btn-loading {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}
.dot-bounce {
  font-size: 0.6rem;
  animation: dotBounce 0.6s var(--d, 0s) ease-in-out infinite alternate;
}
@keyframes dotBounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-6px);
  }
}

/* ボタン内テキスト切り替えアニメーション */
.btn-text-enter-active,
.btn-text-leave-active {
  transition: all 0.15s;
}
.btn-text-enter-from,
.btn-text-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
