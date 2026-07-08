const STORAGE_KEY = "erno-timer-state-v1";
const THEME_LABELS = {
  light: "Switch to dark mode",
  dark: "Switch to light mode",
};

const landing = document.querySelector("#landing");
const themeButton = document.querySelector("#landingThemeButton");

applyStoredTheme();
updateLandingScroll();

themeButton?.addEventListener("click", toggleLandingTheme);
window.addEventListener("scroll", updateLandingScroll, { passive: true });
window.addEventListener("resize", updateLandingScroll);

function getStoredState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveStoredTheme(theme) {
  const state = getStoredState();
  const settings = { ...(state.settings ?? {}), theme };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, settings }));
}

function applyStoredTheme() {
  const state = getStoredState();
  const theme = state.settings?.theme === "dark" || state.settings?.theme === "light"
    ? state.settings.theme
    : getPreferredTheme();

  document.documentElement.dataset.theme = theme;
  if (themeButton) {
    themeButton.setAttribute("aria-label", THEME_LABELS[theme]);
    themeButton.title = THEME_LABELS[theme];
  }
}

function toggleLandingTheme() {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  saveStoredTheme(nextTheme);
  applyStoredTheme();
}

function updateLandingScroll() {
  if (!landing) return;

  const rect = landing.getBoundingClientRect();
  const viewportHeight = Math.max(1, window.innerHeight || 1);
  const scrollRange = Math.max(1, rect.height - viewportHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));
  const lineFill = (start, end, floor = 0) => {
    const lineProgress = (progress - start) / (end - start);
    return Math.min(100, Math.max(floor, lineProgress * 100));
  };
  const actionProgress = (progress - 0.78) / 0.18;
  const actionsAlpha = Math.min(1, Math.max(0, actionProgress));

  landing.style.setProperty("--landing-lift", `${Math.round(progress * -10)}px`);
  landing.style.setProperty("--landing-fade", String(Math.max(0.9, 1 - progress * 0.06).toFixed(3)));
  landing.style.setProperty("--line-fill-1", `${lineFill(0.02, 0.26, 6).toFixed(2)}%`);
  landing.style.setProperty("--line-fill-2", `${lineFill(0.24, 0.48).toFixed(2)}%`);
  landing.style.setProperty("--line-fill-3", `${lineFill(0.46, 0.7).toFixed(2)}%`);
  landing.style.setProperty("--line-fill-4", `${lineFill(0.66, 0.9).toFixed(2)}%`);
  landing.style.setProperty("--actions-alpha", actionsAlpha.toFixed(3));
  landing.classList.toggle("is-actions-ready", actionsAlpha > 0.92);
}

function getPreferredTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
