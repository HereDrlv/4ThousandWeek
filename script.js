const TOTAL_WEEKS = 4000;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const form = document.getElementById("life-form");
const birthdayInput = document.getElementById("birthday");
const grid = document.getElementById("weeks-grid");

const totalWeeksEl = document.getElementById("total-weeks");
const livedWeeksEl = document.getElementById("lived-weeks");
const remainingWeeksEl = document.getElementById("remaining-weeks");
const progressEl = document.getElementById("progress");
const messageEl = document.getElementById("message");

totalWeeksEl.textContent = String(TOTAL_WEEKS);

function createGrid(livedWeeks) {
  grid.innerHTML = "";

  for (let i = 0; i < TOTAL_WEEKS; i += 1) {
    const cell = document.createElement("div");
    cell.className = "week";

    if (i < livedWeeks) {
      cell.classList.add("lived");
    }

    grid.appendChild(cell);
  }
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getLivedWeeks(birthday) {
  const today = startOfDay(new Date());
  const birth = startOfDay(birthday);

  const diff = today.getTime() - birth.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.floor(diff / MS_PER_WEEK);
}

function updateStats(livedWeeks) {
  const clampedLived = Math.min(Math.max(livedWeeks, 0), TOTAL_WEEKS);
  const remaining = TOTAL_WEEKS - clampedLived;
  const progress = ((clampedLived / TOTAL_WEEKS) * 100).toFixed(1);

  livedWeeksEl.textContent = String(clampedLived);
  remainingWeeksEl.textContent = String(remaining);
  progressEl.textContent = `${progress}%`;
}

function parseBirthday(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function renderTimeline(birthday) {
  const livedWeeks = getLivedWeeks(birthday);
  updateStats(livedWeeks);
  createGrid(Math.min(livedWeeks, TOTAL_WEEKS));

  if (livedWeeks >= TOTAL_WEEKS) {
    messageEl.textContent = "按照四千周假设，你的 4000 周已全部点亮。";
    return;
  }

  messageEl.textContent = `从 ${birthday.toLocaleDateString("zh-CN")} 到今天，你已走过 ${Math.max(livedWeeks, 0)} 周。`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const birthday = parseBirthday(birthdayInput.value);

  if (!birthday) {
    messageEl.textContent = "请输入有效生日。";
    return;
  }

  const today = startOfDay(new Date());
  if (birthday > today) {
    messageEl.textContent = "生日不能晚于今天。";
    return;
  }

  renderTimeline(birthday);
});

createGrid(0);
