// ---------- 상태 ----------
const MAX_ENERGY = 100;
const CELL_COUNT = 20;
let energy = 0;
let charged = false;

const gaugeCells = document.getElementById('gaugeCells');
const gaugePercent = document.getElementById('gaugePercent');
const gaugeStatus = document.getElementById('gaugeStatus');
const gaugeEl = document.querySelector('.gauge');
const scenePlayground = document.getElementById('scenePlayground');
const sceneVillage = document.getElementById('sceneVillage');
const touchField = document.getElementById('touchField');
const resetBtn = document.getElementById('resetBtn');

// ---------- 게이지 셀 생성 ----------
for (let i = 0; i < CELL_COUNT; i++) {
  gaugeCells.appendChild(document.createElement('span'));
}
const cellEls = gaugeCells.querySelectorAll('span');

function updateGauge() {
  gaugePercent.textContent = Math.round(energy);
  const litCells = Math.round((energy / MAX_ENERGY) * CELL_COUNT);
  cellEls.forEach((cell, i) => cell.classList.toggle('filled', i < litCells));

  if (energy <= 0) gaugeStatus.textContent = '가동 대기 중';
  else if (energy < MAX_ENERGY) gaugeStatus.textContent = '충전 중';
  else gaugeStatus.textContent = '충전 완료';
}

// ---------- 스파크 이펙트 ----------
function burstSpark(deviceKey) {
  const layer = document.getElementById('spark-' + deviceKey);
  if (!layer) return;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 28 + Math.random() * 20;
    spark.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    spark.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    layer.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  }
}

// ---------- 번개 튐 효과 ----------
function burstBolts(deviceKey) {
  const layer = document.getElementById('spark-' + deviceKey);
  if (!layer) return;
  const positions = [[-18, -12], [16, -18], [2, 14]];
  positions.forEach(([dx, dy], i) => {
    setTimeout(() => {
      const bolt = document.createElement('div');
      bolt.className = 'bolt';
      bolt.textContent = '⚡';
      bolt.style.left = `calc(50% + ${dx}px)`;
      bolt.style.top = `calc(50% + ${dy}px)`;
      layer.appendChild(bolt);
      setTimeout(() => bolt.remove(), 560);
    }, i * 60);
  });
}

// ---------- "+20%" 발전량 라벨 ----------
function showEnergyLabel(deviceKey, amount) {
  const layer = document.getElementById('spark-' + deviceKey);
  if (!layer) return;
  const label = document.createElement('div');
  label.className = 'energy-label';
  label.textContent = '+' + Math.round(amount) + '%';
  layer.appendChild(label);
  setTimeout(() => label.remove(), 1000);
}

// ---------- 놀이기구 → 게이지로 날아가는 에너지 알갱이 ----------
function flyEnergyToGauge(originEl) {
  if (!originEl || !gaugeEl) return;
  const from = originEl.getBoundingClientRect();
  const to = gaugeEl.getBoundingClientRect();
  const startX = from.left + from.width / 2;
  const startY = from.top + from.height / 2;
  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;

  const orb = document.createElement('div');
  orb.className = 'energy-orb';
  orb.style.left = startX + 'px';
  orb.style.top = startY + 'px';
  document.body.appendChild(orb);

  requestAnimationFrame(() => {
    orb.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.3)`;
    orb.style.opacity = '0';
  });

  setTimeout(() => orb.remove(), 950);
}

// ---------- 놀이기구 터치 처리 ----------
function playDevice(key, btnEl) {
  if (charged) return;

  burstSpark(key);
  burstBolts(key);

  // 터치 1회당 20%씩 충전, 100%를 넘지 않도록 제한
  const gain = Math.min(20, MAX_ENERGY - energy);
  energy = Math.min(MAX_ENERGY, energy + gain);
  showEnergyLabel(key, gain);
  flyEnergyToGauge(btnEl);
  updateGauge();

  if (energy >= MAX_ENERGY && !charged) {
    charged = true;
    touchField.classList.add('hidden');
    setTimeout(transitionToVillage, 500);
  }
}

// 손가락 버튼 클릭 처리
touchField.addEventListener('click', (e) => {
  const btn = e.target.closest('.touch-btn');
  if (!btn) return;
  const key = btn.dataset.device;
  const openers = {
    swing: openSwingGame,
    slide: openSlideGame,
    seesaw: openSeesawGame,
    carousel: openCarouselGame,
    numberpad: openNumberpadGame,
    wheel: openWheelGame,
  };
  if (openers[key]) openers[key](btn);
});

// ================= 놀이기구별 미니 게임 =================

const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalFeedback = document.getElementById('modalFeedback');
const modalCancel = document.getElementById('modalCancel');

const allGames = {
  swing:     document.getElementById('gameSwing'),
  slide:     document.getElementById('gameSlide'),
  seesaw:    document.getElementById('gameSeesaw'),
  carousel:  document.getElementById('gameCarousel'),
  numberpad: document.getElementById('gameNumberpad'),
  wheel:     document.getElementById('gameWheel'),
};

let activeDeviceKey = null;
let activeButtonEl = null;

function showGame(key) {
  Object.entries(allGames).forEach(([k, el]) => el.classList.toggle('active', k === key));
}

function openModal(key, btnEl, title) {
  activeDeviceKey = key;
  activeButtonEl = btnEl;
  modalTitle.textContent = title;
  modalFeedback.textContent = '';
  modalFeedback.className = 'modal-feedback';
  showGame(key);
  modalBackdrop.classList.add('open');
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  stopSwingLoop();
  wheelDragging = false;
  activeDeviceKey = null;
  activeButtonEl = null;
}

modalCancel.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

function finishMiniGame(success) {
  if (success) {
    modalFeedback.textContent = '성공! 전기가 만들어졌어요';
    modalFeedback.className = 'modal-feedback success';
    const key = activeDeviceKey;
    const btn = activeButtonEl;
    setTimeout(() => {
      closeModal();
      playDevice(key, btn);
    }, 550);
  } else {
    modalFeedback.textContent = '아쉬워요! 한 번 더 해볼까요?';
    modalFeedback.className = 'modal-feedback fail';
  }
}

// ---------- 그네: 타이밍 맞추기 ----------
const timingMarker = document.getElementById('timingMarker');
const timingStop = document.getElementById('timingStop');
let swingRafId = null;
let swingPos = 0;

function openSwingGame(btn) {
  openModal('swing', btn, '그네 발전기');
  startSwingLoop();
}

function startSwingLoop() {
  const start = performance.now();
  function tick(now) {
    const t = (now - start) / 900;
    swingPos = (Math.sin(t) + 1) / 2 * 100;
    timingMarker.style.left = swingPos + '%';
    swingRafId = requestAnimationFrame(tick);
  }
  swingRafId = requestAnimationFrame(tick);
}

function stopSwingLoop() {
  if (swingRafId) cancelAnimationFrame(swingRafId);
  swingRafId = null;
}

timingStop.addEventListener('click', () => {
  stopSwingLoop();
  const inZone = swingPos >= 40 && swingPos <= 60;
  if (inZone) {
    finishMiniGame(true);
  } else {
    finishMiniGame(false);
    setTimeout(startSwingLoop, 400);
  }
});

// ---------- 미끄럼틀: 롤러 드래그 ----------
const slideTrack = document.getElementById('slideTrack');
const slideRoller = document.getElementById('slideRoller');
let slideDragging = false;
let trackHeight = 0;
const rollerSize = 44;

function openSlideGame(btn) {
  openModal('slide', btn, '미끄럼틀 발전기');
  slideRoller.style.top = '6px';
  slideRoller.style.transform = 'rotate(0deg)';
  trackHeight = slideTrack.clientHeight;
}

function clampY(y) {
  return Math.max(6, Math.min(y, trackHeight - rollerSize - 6));
}

slideRoller.addEventListener('pointerdown', (e) => {
  slideDragging = true;
  slideRoller.classList.add('dragging');
  slideRoller.setPointerCapture(e.pointerId);
});

slideRoller.addEventListener('pointermove', (e) => {
  if (!slideDragging) return;
  const trackRect = slideTrack.getBoundingClientRect();
  const y = clampY(e.clientY - trackRect.top - rollerSize / 2);
  slideRoller.style.top = y + 'px';
  const progress = y / (trackHeight - rollerSize - 6);
  slideRoller.style.transform = `rotate(${progress * 720}deg)`;
});

slideRoller.addEventListener('pointerup', () => {
  if (!slideDragging) return;
  slideDragging = false;
  slideRoller.classList.remove('dragging');
  const currentTop = parseFloat(slideRoller.style.top) || 6;
  const progress = currentTop / (trackHeight - rollerSize - 6);

  if (progress >= 0.85) {
    finishMiniGame(true);
  } else {
    finishMiniGame(false);
    slideRoller.style.top = '6px';
    slideRoller.style.transform = 'rotate(0deg)';
  }
});

// ---------- 시소: 양쪽 번갈아 누르기 ----------
const seesawVisual = document.getElementById('seesawVisual');
const seesawProgress = document.getElementById('seesawProgress');
const seesawLeftBtn = document.getElementById('seesawLeft');
const seesawRightBtn = document.getElementById('seesawRight');
const SEESAW_TARGET = 6;
let seesawCount = 0;
let seesawLastSide = null;

function openSeesawGame(btn) {
  openModal('seesaw', btn, '시소 발전기');
  seesawCount = 0;
  seesawLastSide = null;
  seesawProgress.style.width = '0%';
  seesawVisual.className = 'seesaw-plank-visual';
}

function pressSeesaw(side) {
  seesawVisual.className = 'seesaw-plank-visual ' + (side === 'left' ? 'tilt-left' : 'tilt-right');
  if (side !== seesawLastSide) {
    seesawLastSide = side;
    seesawCount++;
    seesawProgress.style.width = Math.min(100, (seesawCount / SEESAW_TARGET) * 100) + '%';
    if (seesawCount >= SEESAW_TARGET) finishMiniGame(true);
  }
}

seesawLeftBtn.addEventListener('click', () => pressSeesaw('left'));
seesawRightBtn.addEventListener('click', () => pressSeesaw('right'));

// ---------- 회전 놀이기구 / 숫자 놀이 패드: 반복 탭 ----------
function makeTapCounterGame(key, title, visualEl, buttonEl, progressEl, target) {
  let count = 0;
  let spin = 0;

  function open(btn) {
    openModal(key, btn, title);
    count = 0;
    spin = 0;
    progressEl.style.width = '0%';
    visualEl.style.transform = 'rotate(0deg)';
  }

  buttonEl.addEventListener('click', () => {
    count++;
    spin += 45;
    visualEl.style.transform = `rotate(${spin}deg)`;
    progressEl.style.width = Math.min(100, (count / target) * 100) + '%';
    if (count >= target) finishMiniGame(true);
  });

  return open;
}

const openCarouselGame = makeTapCounterGame(
  'carousel', '회전 놀이기구 발전기',
  document.getElementById('carouselVisual'),
  document.getElementById('carouselPush'),
  document.getElementById('carouselProgress'),
  8
);

const openNumberpadGame = makeTapCounterGame(
  'numberpad', '숫자 놀이 패드',
  document.getElementById('numberpadVisual'),
  document.getElementById('numberpadPush'),
  document.getElementById('numberpadProgress'),
  8
);

// ---------- 손잡이 회전 장치: 원 그리며 돌리기 ----------
const wheelDial = document.getElementById('wheelDial');
const wheelRotor = document.getElementById('wheelRotor');
const wheelHandle = document.getElementById('wheelHandle');
const wheelProgress = document.getElementById('wheelProgress');
const WHEEL_TARGET_DEG = 720;
let wheelDragging = false;
let wheelLastAngle = 0;
let wheelTotalRotation = 0;
let wheelCurrentAngle = 0;

function openWheelGame(btn) {
  openModal('wheel', btn, '손잡이 회전 장치');
  wheelTotalRotation = 0;
  wheelCurrentAngle = 0;
  wheelRotor.style.transform = 'rotate(0deg)';
  wheelProgress.style.width = '0%';
}

function angleFromCenter(clientX, clientY) {
  const rect = wheelDial.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
}

wheelHandle.addEventListener('pointerdown', (e) => {
  wheelDragging = true;
  wheelHandle.classList.add('dragging');
  wheelHandle.setPointerCapture(e.pointerId);
  wheelLastAngle = angleFromCenter(e.clientX, e.clientY);
});

wheelHandle.addEventListener('pointermove', (e) => {
  if (!wheelDragging) return;
  const angle = angleFromCenter(e.clientX, e.clientY);
  let delta = angle - wheelLastAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  wheelCurrentAngle += delta;
  wheelTotalRotation += Math.abs(delta);
  wheelLastAngle = angle;

  wheelRotor.style.transform = `rotate(${wheelCurrentAngle}deg)`;
  wheelProgress.style.width = Math.min(100, (wheelTotalRotation / WHEEL_TARGET_DEG) * 100) + '%';

  if (wheelTotalRotation >= WHEEL_TARGET_DEG) {
    wheelDragging = false;
    finishMiniGame(true);
  }
});

wheelHandle.addEventListener('pointerup', () => {
  wheelDragging = false;
  wheelHandle.classList.remove('dragging');
});

// ---------- 장면 전환: 놀이터 → 마을 ----------
function transitionToVillage() {
  scenePlayground.classList.remove('active');
  sceneVillage.classList.add('active');
  setTimeout(() => sceneVillage.classList.add('lit'), 700);
}

// ---------- 리셋 ----------
function resetAll() {
  energy = 0;
  charged = false;
  updateGauge();
  sceneVillage.classList.remove('lit');
  sceneVillage.classList.remove('active');
  scenePlayground.classList.add('active');
  touchField.classList.remove('hidden');
  closeModal();
}

resetBtn.addEventListener('click', resetAll);

// 초기화
updateGauge();
