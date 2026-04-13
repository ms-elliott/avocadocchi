<template>
  <div
    :class="result === 'ripe' ? 'bg-yellow-100' : 'bg-green-100'"
    class="p-4 rounded-xl animate-fadeIn"
  >
    <!-- <h2 class="text-2xl mb-4 animate-slideUp">
      {{ result === 'ripe' ? '食べごろ！！🥑' : 'まだかたいかも…' }}
    </h2> -->
    <img :src="title" alt="" />

    <img
      :src="characterImage"
      :class="result === 'ripe' ? 'animate-happy' : 'animate-sad'"
      class="w-2/3 mx-auto"
    />

    <!-- <p class="my-3 text-lg animate-fadeIn">{{ message }}</p> -->
    <img :src="message" alt="" />

    <div
      class="bg-white rounded-xl p-4 border-2 border-dashed border-green-300 my-4 animate-fadeIn"
    >
      {{ randomTip }}
    </div>

    <button
      @click="$emit('reset')"
      class="group h-10 select-none rounded-[4px] bg-orange-600 px-4 leading-10 text-zinc-50 shadow-[0_-1px_0_1px_#7c2d12_inset,0_0_0_1px_#c2410c_inset,0_0.5px_0_1.5px_#fb923c_inset] hover:bg-orange-700 active:bg-orange-800 active:shadow-[-1px_0px_1px_0px_rgba(0,0,0,.2)_inset,1px_0px_1px_0px_rgba(0,0,0,.2)_inset,0px_0.125rem_0px_0px_rgba(0,0,0,.2)_inset]"
    >
      <span class="block group-active:[transform:translate3d(0,1px,0)]">Click me</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { result } = defineProps({ result: String })

const title = computed(() => (result === 'ripe' ? '/img/msg_ripe1.png' : '/img/msg_unripe1.png'))

const characterImage = computed(() =>
  result === 'ripe' ? '/img/avo_happy.png' : '/img/avo_sad.png',
)

const message = computed(() => (result === 'ripe' ? '/img/msg_ripe2.png' : '/img/msg_unripe2.png'))

const tips = [
  'アボカドは果物です',
  '森のバターと呼ばれています',
  '栄養価がとても高いです',
  'ギネスに載るほど栄養豊富です',
]

const randomTip = tips[Math.floor(Math.random() * tips.length)]
</script>

<style scoped>
/* ===== 初回表示アニメーション ===== */

/* @keyframes titleFade {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-title {
  animation: titleFade 0.6s ease;
} */

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

/* 浮遊
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
} */
</style>
