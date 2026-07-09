@import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Noto+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root {
  --dusk: #2B3A42;
  --dusk-deep: #1F2A30;
  --amber: #F2A65A;
  --amber-soft: #F7C68B;
  --sand: #EFE4CE;
  --sand-deep: #E2D3B4;
  --leaf: #4A7C59;
  --leaf-deep: #3C6A49;
  --night: #131B24;
  --night-deep: #0B1116;
  --glow: #FFE29A;
  --ink: #22201B;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--sand);
  color: var(--ink);
  font-family: 'Noto Sans KR', sans-serif;
}

/* ---------- HERO / GAUGE ---------- */

.hero {
  background: var(--dusk);
  color: var(--sand);
  padding: 40px 24px 44px;
  text-align: center;
}

.eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  color: var(--amber-soft);
  text-transform: uppercase;
  margin: 0 0 10px;
}

.hero h1 {
  font-family: 'Do Hyeon', sans-serif;
  font-size: clamp(32px, 6vw, 52px);
  margin: 0 0 10px;
  letter-spacing: 0.02em;
}

.subtitle {
  margin: 0 auto 28px;
  max-width: 540px;
  color: var(--sand-deep);
  font-size: 15px;
  line-height: 1.6;
}

.gauge-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }

.gauge {
  position: relative;
  width: min(90vw, 480px);
  height: 64px;
  background: var(--night-deep);
  border-radius: 14px;
  border: 2px solid rgba(242,166,90,0.35);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-cells {
  position: absolute;
  inset: 8px;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 3px;
  border-radius: 8px;
  overflow: hidden;
}

.gauge-cells span {
  background: rgba(242,166,90,0.08);
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.gauge-cells span.filled {
  background: var(--amber);
  box-shadow: 0 0 8px rgba(242,166,90,0.7);
}

.gauge-label {
  position: relative;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 26px;
  font-weight: 600;
  color: var(--sand);
  z-index: 2;
  text-shadow: 0 0 12px rgba(0,0,0,0.6);
}

.percent-sign { font-size: 16px; margin-left: 2px; }

.gauge-caption { font-size: 13px; color: var(--sand-deep); margin: 0; }
#gaugeStatus { color: var(--amber-soft); font-weight: 500; }

/* ---------- STORAGE STRIP ---------- */

.storage-strip {
  background: var(--leaf);
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  padding: 12px 24px;
  font-size: 13px;
  font-family: 'IBM Plex Mono', monospace;
}

.storage-item { display: flex; align-items: center; gap: 8px; }
.storage-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; background: var(--amber); }
.storage-dot.ess { background: var(--sand); }
.storage-dot.grid { background: var(--dusk); }

/* ---------- SCENE STAGE (풍경 전환) ---------- */

.scene-stage {
  position: relative;
  width: 100%;
  height: min(78vw, 480px);
  min-height: 320px;
  overflow: hidden;
  background: var(--night-deep);
}

.scene {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.03);
  transition: opacity 0.9s ease, transform 0.9s ease;
  pointer-events: none;
}

.scene.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

/* ---------- 놀이터 풍경 ---------- */

.landscape-svg { width: 100%; height: 100%; display: block; }

.sun { fill: var(--amber); }
.cloud { fill: rgba(255,255,255,0.75); }
.grass { fill: var(--leaf); }
.grass-edge { fill: none; stroke: var(--leaf-deep); stroke-width: 2; }

.device-label {
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 15px;
  fill: var(--dusk-deep);
}

.device-hotspot { cursor: pointer; transition: transform 0.15s ease; transform-box: fill-box; transform-origin: center; }
.device-hotspot:hover { transform: translateY(-3px); }

.slide-frame, .plank, .wheel-ring, .wheel-spoke, .carousel-base, .swing-bar, .swing-rope, .pad-base {
  fill: none;
  stroke: var(--sand);
  stroke-width: 4;
  stroke-linecap: round;
}

.pad-base { fill: var(--dusk-deep); stroke: var(--amber-soft); stroke-width: 3; }
.pad-number { fill: var(--sand); font-family: 'IBM Plex Mono', monospace; font-size: 30px; font-weight: 600; }

.rider { fill: var(--amber); }
.rider-b { fill: var(--leaf-deep); }
.seesaw-pivot { fill: var(--sand-deep); }

/* device motion animations */
#rider-slide { transform-origin: center; }
#rider-slide.playing { animation: slideDown 0.9s ease-in forwards; }
@keyframes slideDown {
  0%   { transform: translate(0,0); }
  100% { transform: translate(140px, 110px); }
}

.swing-pivot { transform-origin: 100px 10px; }
.swing-pivot.playing { animation: swingMotion 0.9s ease-in-out; }
@keyframes swingMotion {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(28deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(-28deg); }
  100% { transform: rotate(0deg); }
}

.seesaw-plank { transform-origin: 100px 100px; }
.seesaw-plank.playing { animation: seesawMotion 0.9s ease-in-out; }
@keyframes seesawMotion {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-16deg); }
  75%  { transform: rotate(16deg); }
  100% { transform: rotate(0deg); }
}

.carousel-spin { transform-origin: 100px 80px; }
.carousel-spin.playing { animation: spinMotion 0.9s linear; }
@keyframes spinMotion { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

#rider-numberpad.playing .pad-base { animation: padPress 0.35s ease-in-out; }
@keyframes padPress { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.92); } }

.wheel-spin { transform-origin: 100px 80px; }
.wheel-spin.playing { animation: spinMotion 0.9s ease-in-out; }

/* ---------- 스파크 이펙트 (HTML 오버레이) ---------- */

.spark-field { position: absolute; inset: 0; pointer-events: none; }

.spark-layer {
  position: absolute;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.spark {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 6px var(--amber);
  animation: sparkOut 0.6s ease-out forwards;
}

@keyframes sparkOut {
  from { transform: translate(0,0) scale(1); opacity: 1; }
  to { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}

/* ---------- 밤의 마을 풍경 ---------- */

.village-svg { width: 100%; height: 100%; display: block; }
.village-scene { display: flex; flex-direction: column; align-items: center; justify-content: center; }

.sky { fill: var(--night); }
.moon-sun { fill: #DCE3E8; transition: fill 1s ease, r 1s ease; }

.pole, .lamp-pole { stroke: #3A4753; stroke-width: 4; }
.blade { stroke: #55606B; stroke-width: 4; stroke-linecap: round; }
.blades { transform-origin: center; }

.panel { fill: #2E3A44; stroke: #55606B; stroke-width: 2; }
.panel-line { stroke: #55606B; stroke-width: 1.5; }

.house-body { fill: #232D36; stroke: #3A4753; stroke-width: 2; }
.house-roof { fill: #1A222A; }
.window { fill: #3A4753; transition: fill 0.6s ease; }
.lamp-bulb { fill: #3A4753; transition: fill 0.6s ease; }

.still-body { fill: #2E3A44; stroke: #55606B; stroke-width: 2; }
.water-roller { fill: #55606B; }
.ground { fill: var(--dusk-deep); }

.village-scene.lit .window { fill: var(--glow); filter: drop-shadow(0 0 5px var(--glow)); }
.village-scene.lit .lamp-bulb { fill: var(--glow); filter: drop-shadow(0 0 8px var(--glow)); }
.village-scene.lit .moon-sun { fill: #FFE9B0; r: 30; }
.village-scene.lit .blades { animation: turbineSpin 3s linear infinite; }

.village-scene.lit #win1 { transition-delay: 0.15s; }
.village-scene.lit #win2 { transition-delay: 0.3s; }
.village-scene.lit #win3 { transition-delay: 0.45s; }
.village-scene.lit #win4 { transition-delay: 0.6s; }
.village-scene.lit #win5 { transition-delay: 0.75s; }
.village-scene.lit #lamp1 .lamp-bulb { transition-delay: 0.9s; }
.village-scene.lit #lamp2 .lamp-bulb { transition-delay: 1.05s; }

@keyframes turbineSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.village-message {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: var(--sand-deep);
  font-size: 14px;
  text-align: center;
  width: 90%;
  opacity: 0;
  transition: opacity 0.8s ease 1.1s;
}

.village-scene.lit .village-message { color: var(--glow); font-weight: 500; opacity: 1; }

/* ---------- RESET BUTTON ---------- */

.reset-btn {
  display: block;
  margin: 28px auto 40px;
  padding: 12px 28px;
  background: var(--amber);
  color: var(--night-deep);
  border: none;
  border-radius: 999px;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.reset-btn:hover { transform: scale(1.04); background: var(--amber-soft); }

@media (max-width: 480px) {
  .gauge-cells { grid-template-columns: repeat(10, 1fr); }
  .device-label { font-size: 20px; }
}
