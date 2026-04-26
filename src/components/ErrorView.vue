<script setup>
const props = defineProps({
  message: String,
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="error">
    <h2>エラー発生 😢</h2>
    <p>{{ message }}</p>

    <!-- <button @click="emit('retry')">もう一度試す</button> -->
    <button
      @click="emit('retry')"
      class="group h-10 select-none rounded-[4px] bg-orange-600 px-4 leading-10 text-zinc-50 shadow-[0_-1px_0_1px_#7c2d12_inset,0_0_0_1px_#c2410c_inset,0_0.5px_0_1.5px_#fb923c_inset] hover:bg-orange-700 active:bg-orange-800 active:shadow-[-1px_0px_1px_0px_rgba(0,0,0,.2)_inset,1px_0px_1px_0px_rgba(0,0,0,.2)_inset,0px_0.125rem_0px_0px_rgba(0,0,0,.2)_inset]"
    >
      <span class="block group-active:[transform:translate3d(0,1px,0)]">もう一度</span>
    </button>
  </div>
</template>
