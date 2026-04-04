<template>
  <div
    class="upload-zone"
    :class="{ dragging: isDragging, 'has-image': modelValue }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onFileChange"
    />

    <transition name="fade" mode="out-in">
      <div v-if="modelValue" key="preview" class="preview-inner">
        <img :src="modelValue" class="preview-img" alt="preview" />
        <div class="preview-overlay"><span>📷 変える</span></div>
      </div>
      <div v-else key="empty" class="upload-empty">
        <div class="upload-icon-wrap">
          <span class="upload-camera">📸</span>
          <div class="upload-ring ring1"></div>
          <div class="upload-ring ring2"></div>
        </div>
        <p class="upload-main">タップして写真を撮る</p>
        <p class="upload-sub">ドラッグ＆ドロップもOK</p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'UploadZone',
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: String, default: null }, // base64 preview URL
  },
  data() {
    return { isDragging: false }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileChange(e) {
      const f = e.target.files[0]
      if (f) this.loadPreview(f)
    },
    onDrop(e) {
      this.isDragging = false
      const f = e.dataTransfer.files[0]
      if (f) this.loadPreview(f)
    },
    loadPreview(file) {
      const reader = new FileReader()
      reader.onload = (e) => this.$emit('update:modelValue', e.target.result)
      reader.readAsDataURL(file)
    },
  },
}
</script>

<style scoped>
.upload-zone {
  width: 100%;
  min-height: 200px;
  border: 3px dashed #86efac;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-zone:hover,
.upload-zone.dragging {
  border-color: #f4a261;
  transform: scale(1.02);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.13);
}
.hidden {
  display: none;
}
.upload-empty {
  text-align: center;
  padding: 2rem;
}
.upload-icon-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 0.8rem;
}
.upload-camera {
  font-size: 3rem;
  display: block;
}
.upload-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid #86efac;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ringPulse 2s ease-out infinite;
}
.ring1 {
  width: 60px;
  height: 60px;
  animation-delay: 0s;
}
.ring2 {
  width: 80px;
  height: 80px;
  animation-delay: 0.6s;
}
@keyframes ringPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}
.upload-main {
  font-size: 1rem;
  font-weight: 800;
  color: #374151;
}
.upload-sub {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 4px;
  font-weight: 700;
}
.preview-inner {
  position: relative;
  width: 100%;
}
.preview-img {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  display: block;
}
.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  font-weight: 800;
  color: transparent;
  font-size: 1rem;
}
.upload-zone:hover .preview-overlay {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
