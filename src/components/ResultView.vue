<template>
  <div class="p-4 rounded-xl relative">
    <!--  完熟時の紙吹雪 -->
    <canvas v-if="result === 'ripe'" ref="confettiCanvas" class="confetti-canvas" />

    <img :src="title" alt="" />
    <div class="character-wrap">
      <img
        :src="characterImage"
        :class="result === 'ripe' ? 'animate-happy' : 'animate-sad'"
        class="w-2/3 mx-auto relative z-10"
      />
      <div v-if="result !== 'ripe'" class="comic-scribble">
        <svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
          <!-- もくもく吹き出し -->
          <circle cx="20" cy="25" r="18" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="38" cy="15" r="14" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="58" cy="13" r="16" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="75" cy="22" r="15" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="80" cy="38" r="14" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="72" cy="52" r="13" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="55" cy="58" r="14" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="37" cy="56" r="13" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="22" cy="46" r="14" fill="white" stroke="#333" stroke-width="2" />
          <!-- 中を白で塗りつぶして境界線を消す -->
          <ellipse cx="50" cy="37" rx="32" ry="22" fill="white" />
          <!-- しっぽ（もくもく小さい丸） -->
          <circle cx="18" cy="68" r="7" fill="white" stroke="#333" stroke-width="2" />
          <circle cx="12" cy="78" r="5" fill="white" stroke="#333" stroke-width="2" />

          <!-- ぐちゃぐちゃ線 -->
          <path
            d="M25,30 Q30,20 40,28 Q48,34 38,40 Q30,46 22,40 Q18,34 25,30"
            fill="none"
            stroke="#333"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M42,22 Q55,16 62,28 Q68,38 58,44 Q50,50 42,42 Q36,34 42,22"
            fill="none"
            stroke="#333"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M28,38 Q38,28 50,36 Q60,44 52,52 Q44,58 34,52 Q26,46 28,38"
            fill="none"
            stroke="#444"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M35,25 Q28,35 36,44 Q44,52 55,46 Q64,38 60,28 Q54,18 44,22 Q36,26 35,25"
            fill="none"
            stroke="#222"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M30,42 Q40,32 52,38 Q58,44 50,50 Q40,56 32,50 Q26,46 30,42"
            fill="none"
            stroke="#555"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
    <img :src="message" alt="" />
    <!--  スコア表示 -->
    <div class="score-wrap">
      <p class="score-label">信頼度</p>
      <div class="score-bar-wrap">
        <div class="score-bar" :style="{ width: score + '%' }"></div>
      </div>
      <p class="score-num">{{ score }}%</p>
    </div>
    <div class="bg-white rounded-xl p-4 border-2 border-dashed border-green-300 my-5">
      <p>🥑きょうの豆知識✏️</p>
      <br />
      {{ randomTip }}
    </div>

    <button class="btn btn-orange" @click="emit('retry')">もう一度</button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const { result, image, score } = defineProps({ result: String, image: String, score: Number })
const emit = defineEmits(['retry'])

const title = computed(() => (result === 'ripe' ? '/img/msg_ripe1.png' : '/img/msg_unripe1.png'))
const characterImage = computed(() =>
  result === 'ripe' ? '/img/avo_happy.png' : '/img/avo_sad.png',
)
const message = computed(() => (result === 'ripe' ? '/img/msg_ripe2.png' : '/img/msg_unripe2.png'))

const tips = [
  'アボカドは野菜じゃなくて果物だよ！知ってた？',
  '森のバターと呼ばれているよ！',
  '栄養価がとても高くて健康にいいんだ！',
  'じつはギネスに載るほど栄養豊富！',
  'かたかった場合はレンジでチンしてみてね。',
  'バナナやリンゴと一緒に常温保存すると早く熟すよ！',
  '表面がゴツゴツよりもツルツルの方が美味しいんだって！',
  '洋梨型よりも球体型の方が甘いことが多いみたい！',
]
const randomTip = tips[Math.floor(Math.random() * tips.length)]

// ✅ 紙吹雪
const confettiCanvas = ref(null)
let animationId = null

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#60a5fa', '#c084fc', '#f472b6']

onMounted(() => {
  if (result !== 'ripe') return

  const canvas = confettiCanvas.value
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    w: 8 + Math.random() * 8,
    h: 12 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 2 + Math.random() * 4,
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 6,
    drift: (Math.random() - 0.5) * 2,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of pieces) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.angle * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()

      p.y += p.speed
      p.x += p.drift
      p.angle += p.spin

      // 画面外に出たらリセット
      if (p.y > window.innerHeight) {
        p.y = -20
        p.x = Math.random() * window.innerWidth
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.score-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  padding: 0 16px;
}

.score-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: #6b7280;
  white-space: nowrap;
}

.score-bar-wrap {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  border-radius: 99px;
  background: v-bind(
    'result === "ripe" ? "linear-gradient(90deg, #fcd34d, #f59e0b)" : "linear-gradient(90deg, #86efac, #4ade80)"'
  );
  animation: scoreGrow 1s ease-out forwards;
  width: 0%;
}

@keyframes scoreGrow {
  from {
    width: 0%;
  }
  to {
    width: v-bind('score + "%"');
  }
}

.score-num {
  font-size: 1rem;
  font-weight: 900;
  color: v-bind('result === "ripe" ? "#f59e0b" : "#4ade80"');
  white-space: nowrap;
}

.confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

@keyframes entryPop {
  0% {
    transform: scale(0.5) translateY(20px);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) translateY(-10px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-entry {
  animation: entryPop 0.6s ease;
}

.character-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comic-scribble {
  position: absolute;
  right: -5%;
  top: 8%;
  width: 60px;
  height: 60px;
  animation:
    scribbleAppear 0.4s ease-out forwards,
    scribbleWobble 0.8s ease-in-out 0.4s infinite;
  opacity: 0;
}

.comic-scribble svg {
  width: 100%;
  height: 100%;
}

@keyframes scribbleAppear {
  0% {
    transform: scale(0) rotate(-20deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes scribbleWobble {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(3deg);
  }
  50% {
    transform: scale(1) rotate(-3deg);
  }
  75% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
</style>
