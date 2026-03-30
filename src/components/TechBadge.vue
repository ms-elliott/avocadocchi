<template>
  <div class="tech-stack">
    <span class="tech-pill vue">Vue.js</span>
    <span class="tech-x">×</span>
    <span class="tech-pill tf">TensorFlow.js</span>
  </div>
</template>

<script>
export default { name: 'TechBadge' }
</script>

<style scoped>
.tech-stack { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 800; }
.tech-pill { padding: 4px 10px; border-radius: 100px; color: #fff; }
.tech-pill.vue { background: #42b883; }
.tech-pill.tf { background: #ff6f00; }
.tech-x { color: #aaa; }
</style>
