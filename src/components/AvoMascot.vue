<template>
  <div class="mascot-wrap">
    <div class="mascot" @click="$emit('talk')">
      <div class="avo-body" :class="{ 'result-body': size === 'large' }">
        <div class="avo-skin"></div>
        <div class="avo-seed"></div>
        <div class="avo-face">
          <div class="eyes">
            <!-- Home: normal eyes -->
            <template v-if="mode === 'home'">
              <div class="eye left" :class="{ blink: isBlinking }"><div class="pupil"></div></div>
              <div class="eye right" :class="{ blink: isBlinking }"><div class="pupil"></div></div>
            </template>
            <!-- Result ripe: star eyes -->
            <template v-else-if="mode === 'ripe'">
              <div class="eye left star"><span>★</span></div>
              <div class="eye right star"><span>★</span></div>
            </template>
            <!-- Result unripe: sleepy eyes -->
            <template v-else>
              <div class="eye left sleepy-eye"></div>
              <div class="eye right sleepy-eye"></div>
            </template>
          </div>
          <div class="mouth" :class="mouthClass"></div>
          <div v-if="mode === 'home' || mode === 'ripe'" class="blush left"></div>
          <div v-if="mode === 'home' || mode === 'ripe'" class="blush right"></div>
        </div>
        <div class="avo-arms">
          <div class="arm left" :class="armClass"></div>
          <div class="arm right" :class="{ up: mode === 'ripe' }"></div>
        </div>
        <div v-if="mode === 'home'" class="avo-legs">
          <div class="leg left"></div>
          <div class="leg right"></div>
        </div>
      </div>
      <div v-if="mode === 'home'" class="mascot-shadow"></div>
    </div>

    <transition name="bubble-pop">
      <div v-if="message" class="speech-bubble">{{ message }}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AvoMascot',
  emits: ['talk'],
  props: {
    mode: { type: String, default: 'home' }, // 'home' | 'ripe' | 'unripe'
    size: { type: String, default: 'normal' },
    isBlinking: { type: Boolean, default: false },
    isTalking: { type: Boolean, default: false },
    isWaving: { type: Boolean, default: false },
    message: { type: String, default: '' },
  },
  computed: {
    mouthClass() {
      if (this.isTalking) return 'talking'
      if (this.mode === 'ripe') return 'smile-big'
      if (this.mode === 'unripe') return 'sleepy-mouth'
      return ''
    },
    armClass() {
      if (this.isWaving) return 'wave'
      if (this.mode === 'ripe') return 'up'
      return ''
    },
  },
}
</script>

<style scoped>
.mascot-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mascot {
  cursor: pointer;
  user-select: none;
  animation: mascotFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
}
@keyframes mascotFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.mascot-shadow {
  width: 60px; height: 12px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.15), transparent);
  border-radius: 50%;
  margin: 4px auto 0;
  animation: shadowPulse 3s ease-in-out infinite;
}
@keyframes shadowPulse {
  0%, 100% { transform: scaleX(1); opacity: 0.8; }
  50% { transform: scaleX(0.7); opacity: 0.4; }
}
.avo-body {
  position: relative;
  width: 80px; height: 100px;
}
.result-body { width: 90px; height: 112px; }
.avo-skin {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #4a7c59, #2d6a4f);
  border-radius: 40% 40% 50% 50% / 30% 30% 70% 70%;
  box-shadow: inset -8px -8px 16px rgba(0,0,0,0.2), inset 4px 4px 10px rgba(255,255,255,0.1);
}
.avo-seed {
  position: absolute;
  width: 36px; height: 44px;
  background: radial-gradient(circle at 40% 40%, #a0522d, #6b3a2a);
  border-radius: 50%;
  bottom: 16px; left: 50%; transform: translateX(-50%);
  box-shadow: inset 2px 2px 6px rgba(255,255,255,0.15);
}
.avo-face {
  position: absolute;
  top: 22px; left: 50%; transform: translateX(-50%);
  width: 60px;
}
.eyes { display: flex; justify-content: space-between; padding: 0 8px; }
.eye {
  width: 16px; height: 16px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: transform 0.1s;
}
.eye.blink { transform: scaleY(0.1); }
.pupil {
  position: absolute;
  width: 8px; height: 8px;
  background: #222;
  border-radius: 50%;
  top: 4px; left: 4px;
}
.eye.star {
  background: transparent;
  overflow: visible;
  display: flex; align-items: center; justify-content: center;
}
.eye.star span { font-size: 1.1rem; animation: starSpin 1s ease-out; }
@keyframes starSpin { from { transform: rotate(-360deg) scale(0); } to { transform: rotate(0) scale(1); } }
.eye.sleepy-eye {
  height: 8px;
  border-radius: 0 0 50% 50%;
  background: #222;
}
.mouth {
  width: 22px; height: 10px;
  border: 3px solid transparent;
  border-bottom-color: #222;
  border-radius: 0 0 50% 50%;
  margin: 4px auto 0;
  transition: all 0.3s;
}
.mouth.talking { animation: talkAnim 0.2s ease-in-out infinite alternate; }
@keyframes talkAnim {
  from { height: 10px; border-radius: 0 0 50% 50%; }
  to   { height: 16px; border-radius: 50%; border-color: #222; }
}
.mouth.smile-big {
  width: 28px; height: 14px;
  border-bottom-color: #222;
  animation: smilePop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
}
@keyframes smilePop { from { width: 0; } to { width: 28px; } }
.mouth.sleepy-mouth {
  width: 16px; height: 6px;
  border-bottom-color: #888;
}
.blush {
  position: absolute;
  width: 14px; height: 8px;
  background: rgba(255,150,150,0.5);
  border-radius: 50%;
  top: 32px;
}
.blush.left { left: 4px; }
.blush.right { right: 4px; }
.avo-arms { position: absolute; top: 40px; width: 100%; }
.arm {
  position: absolute;
  width: 18px; height: 8px;
  background: #2d6a4f;
  border-radius: 4px;
  transition: transform 0.3s;
}
.arm.left { left: -14px; transform: rotate(30deg); }
.arm.right { right: -14px; transform: rotate(-30deg); }
.arm.left.wave { animation: waveArm 0.4s ease-in-out 3; }
.arm.left.up { transform: rotate(-80deg) translateX(-4px); }
.arm.right.up { transform: rotate(80deg) translateX(4px); }
@keyframes waveArm {
  0%, 100% { transform: rotate(30deg); }
  50% { transform: rotate(-60deg) translateX(-4px); }
}
.avo-legs { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
.leg { width: 10px; height: 14px; background: #2d6a4f; border-radius: 0 0 6px 6px; }

/* Speech bubble */
.speech-bubble {
  background: #fff;
  border-radius: 16px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  position: absolute;
  top: -48px; left: 50%; transform: translateX(-50%);
  white-space: nowrap;
  z-index: 10;
}
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px; left: 50%; transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #fff;
  border-bottom: 0;
}
.bubble-pop-enter-active { animation: bubblePop 0.3s cubic-bezier(0.175,0.885,0.32,1.275); }
.bubble-pop-leave-active { animation: bubblePop 0.2s ease-in reverse; }
@keyframes bubblePop {
  from { transform: translateX(-50%) scale(0); opacity: 0; }
  to   { transform: translateX(-50%) scale(1); opacity: 1; }
}
</style>
