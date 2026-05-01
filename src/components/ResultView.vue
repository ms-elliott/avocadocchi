<template>
  <div class="p-4 rounded-xl animate-fadeIn relative">
    <!-- ✅ 完熟時の紙吹雪 -->
    <canvas v-if="result === 'ripe'" ref="confettiCanvas" class="confetti-canvas" />

    <img :src="title" alt="" />
    <img
      :src="characterImage"
      :class="result === 'ripe' ? 'animate-happy' : 'animate-sad'"
      class="w-2/3 mx-auto"
    />
    <img :src="message" alt="" />

    <div
      class="bg-white rounded-xl p-4 border-2 border-dashed border-green-300 my-4 animate-fadeIn"
    >
      <p>🥑きょうの豆知識✏️</p>
      <br />
      {{ randomTip }}
    </div>

    <button
      @click="emit('retry')"
      class="group h-10 select-none rounded-[4px] bg-orange-600 px-4 my-3 leading-10 text-zinc-50 shadow-[0_-1px_0_1px_#7c2d12_inset,0_0_0_1px_#c2410c_inset,0_0.5px_0_1.5px_#fb923c_inset] hover:bg-orange-700 active:bg-orange-800 active:shadow-[-1px_0px_1px_0px_rgba(0,0,0,.2)_inset,1px_0px_1px_0px_rgba(0,0,0,.2)_inset,0px_0.125rem_0px_0px_rgba(0,0,0,.2)_inset]"
    >
      <span class="block group-active:[transform:translate3d(0,1px,0)]">もう一度</span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const { result } = defineProps({ result: String, image: String })
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
</style>
