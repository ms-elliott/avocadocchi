<template>
  <p>
    {{ result ? '今が食べ頃' : 'もう少し待とう' }}
  </p>
</template>
<script setup>
defineProps({ result: Boolean })
</script>
