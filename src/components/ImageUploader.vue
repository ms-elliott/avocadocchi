<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: String, status: String })

const emit = defineEmits(['update:modelValue', 'predict'])
const preview = ref(null)
const isDragging = ref(false)
const fileInput = ref(null)
// const loading = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    preview.value = val
  },
  { immediate: true },
)

function triggerFileInput() {
  fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (ev) => {
    preview.value = ev.target.result
    emit('update:modelValue', preview.value)
  }
  reader.readAsDataURL(file)
}

function loadPreview(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target.result
    emit('update:modelValue', e.target.result)
  }
  reader.readAsDataURL(file)
}

function onDrop(e) {
  isDragging.value = false
  const f = e.datatransfer.files[0]
  if (f) loadPreview(f)
}

const handlePredict = () => {
  emit('predict')
}
</script>

<template>
  <div
    class="upload-zone"
    :class="{ dragging: isDragging, 'has-image': preview }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="props.status === 'idle' && triggerFileInput()"
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
      <!-- 未選択 -->
      <div v-if="!preview" key="empty" class="upload-empty">
        <div class="upload-icon-wrap">
          <span class="upload-camera">📸</span>
          <div class="upload-ring ring1"></div>
          <div class="upload-ring ring2"></div>
        </div>
        <p class="upload-main">タップして写真を撮る</p>
        <p class="upload-sub">ドラッグ＆ドロップもOK</p>
      </div>

      <!-- プレビュー -->
      <div v-else key="preview" class="preview-inner">
        <img :src="preview" class="preview-img" alt="preview" />
        <div v-if="props.status === 'idle'" class="preview-overlay"><span>📷 変える</span></div>
      </div>
    </transition>
  </div>
  <transition name="fade" mode="out-in">
    <div v-if="preview">
      <button class="predict-btn" @click="handlePredict" :disabled="props.status !== 'idle'">
        判定する
      </button>
    </div>
  </transition>
</template>

<style scoped>
.preview img {
  width: 100%;
  border-radius: 16px;
}

.predict-btn {
  margin-top: 12px;
  padding: 12px;
  width: 100%;
  border-radius: 16px;
  background: #66bb6a;
  color: white;
}

/* アボカドアニメーション */
.avocado {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

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
