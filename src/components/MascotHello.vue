<template>
  <div class="mascot-wrap">
    <img src="/img/avo_hello.png" class="mascot-img animate-entry" />
    <div class="mascot-shadow"></div>
    <div class="speech-bubble animate-fadeIn">
      <p>アボカドが熟れているか<br />AIが画像から判定するよ🥑</p>
    </div>
  </div>
</template>

<style scoped>
.mascot-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 8px;
}

.mascot-img {
  width: 60%;
  opacity: 0;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
}

.mascot-shadow {
  width: 45%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  margin-top: -6px;
  margin-bottom: 8px;
  opacity: 0;
  animation:
    shadowEntry 1.5s ease 2s forwards,
    shadowFloat 4s ease-in-out 4s infinite;
}

@keyframes shadowEntry {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes shadowFloat {
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  50% {
    transform: scaleX(0.7);
    opacity: 0.5;
  } /* 浮いた時は小さく薄く */
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}

/* 吹き出し */
.speech-bubble {
  position: relative;
  background: white;
  border: 2.5px solid #86efac;
  border-radius: 20px;
  padding: 12px 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  line-height: 1.7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  opacity: 0;
}

/* 吹き出しの三角 */
.speech-bubble::before {
  content: '';
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-bottom-color: #86efac;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: white;
}
</style>
