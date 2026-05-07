<script setup>
// ===== 画像アップロード・プレビューコンポーネント =====
// - クリックでファイル選択
// - ドラッグ&ドロップで画像を選択（キャプチャフェーズで捕捉）
// - v-modelで親コンポーネントにbase64画像を渡す
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ modelValue: String, status: String })
const emit = defineEmits(['update:modelValue', 'predict'])

const preview = ref(null)
const isDragging = ref(false)
const fileInput = ref(null)
const uploadZone = ref(null)

// 親からmodelValueが変更された時にプレビューを同期
watch(
  () => props.modelValue,
  (val) => {
    preview.value = val
  },
  { immediate: true },
)

// ファイル選択ダイアログを開く
function triggerFileInput() {
  fileInput.value.click()
}

// ファイル選択時の処理
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) loadPreview(file)
}

// ファイルをbase64に変換してプレビューと親に渡す
function loadPreview(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target.result
    emit('update:modelValue', e.target.result)
  }
  reader.readAsDataURL(file)
}

// ドラッグ&ドロップの処理
// ブラウザのデフォルト動作（新タブで画像を開く）を防ぐため
// キャプチャフェーズでイベントを捕捉する
onMounted(() => {
  uploadZone.value.addEventListener(
    'drop',
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      isDragging.value = false
      const f = e.dataTransfer.files[0]
      if (f) loadPreview(f)
    },
    true, // キャプチャフェーズ
  )
})

// 判定ボタン押下時に親へ通知
function handlePredict() {
  emit('predict')
}
</script>

<template>
  <div
    ref="uploadZone"
    class="upload-zone animate-uploader-fadeIn"
    :class="{ dragging: isDragging, 'has-image': preview }"
    @dragover.prevent.stop="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @click="props.status === 'idle' && triggerFileInput()"
  >
    <!-- 非表示のファイル入力 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onFileChange"
    />

    <transition name="fade" mode="out-in">
      <!-- 未選択状態 -->
      <div v-if="!preview" key="empty" class="upload-empty">
        <div class="upload-icon-wrap">
          <span class="upload-camera">📸</span>
          <div class="upload-ring ring1"></div>
          <div class="upload-ring ring2"></div>
        </div>
        <p class="upload-main">タップして写真を撮る</p>
        <p class="upload-sub">ドラッグ＆ドロップもOK</p>
      </div>

      <!-- プレビュー表示 -->
      <div v-else key="preview" class="preview-inner">
        <img :src="preview" class="preview-img" alt="preview" />
        <div v-if="props.status === 'idle'" class="preview-overlay">
          <span>📷 変える</span>
        </div>
      </div>
    </transition>
  </div>

  <!-- 判定ボタン（画像選択後に表示） -->
  <transition name="fade" mode="out-in">
    <div v-if="preview">
      <button
        class="btn btn-green"
        @click="handlePredict"
        :disabled="props.status !== 'idle'"
        style="margin-top: 15px"
      >
        判定する
      </button>
    </div>
  </transition>
</template>

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
  opacity: 0;
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
  padding: 1.5rem;
}

.upload-icon-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 0.8rem;
}

.upload-camera {
  font-size: 2.5rem;
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
  font-size: 0.95rem;
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
  object-fit: contain;
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
