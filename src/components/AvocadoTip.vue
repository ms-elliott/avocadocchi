<template>
  <div class="tip">
    {{ tip }}
  </div>
</template>

<script setup>
defineProps({ tip: String })
</script>

<style scoped>
.tip {
  margin-top: 16px;
  padding: 16px;
  background: #f1f8e9;
  border-radius: 16px;
}
</style>
