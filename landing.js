const STORAGE_KEY = "erno-timer-state-v1";
const THEME_LABELS = {
  light: "Switch to dark mode",
  dark: "Switch to light mode",
};

const themeButton = document.querySelector("#landingThemeButton");
const accordionCards = Array.from(document.querySelectorAll("[data-accordion-card]"));
const algorithmButtons = Array.from(document.querySelectorAll("[data-copy-algorithm]"));

applyStoredTheme();
setupLandingAccordion();
setupAlgorithmCopy();

themeButton?.addEventListener("click", toggleLandingTheme);

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

function setupLandingAccordion() {
  if (!accordionCards.length) return;

  accordionCards.forEach((card) => {
    const toggle = card.querySelector(".landing-accordion-toggle");
    toggle?.addEventListener("click", () => setActiveAccordionCard(card));
  });
}

function setActiveAccordionCard(activeCard) {
  accordionCards.forEach((card) => {
    const isActive = card === activeCard;
    card.classList.toggle("is-active", isActive);
    card.querySelector(".landing-accordion-toggle")?.setAttribute("aria-expanded", String(isActive));
  });
}

function setupAlgorithmCopy() {
  algorithmButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const algorithm = button.dataset.copyAlgorithm;
      if (!algorithm) return;

      try {
        await navigator.clipboard.writeText(algorithm);
        showCopiedState(button);
      } catch {
        showCopiedState(button, copyTextFallback(algorithm) ? "Copied" : "Select and copy");
      }
    });
  });
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-999px";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function showCopiedState(button, label = "Copied") {
  const labelElement = button.querySelector("span");
  const previousLabel = labelElement?.textContent;

  button.classList.add("is-copied");
  if (labelElement) labelElement.textContent = label;

  window.setTimeout(() => {
    button.classList.remove("is-copied");
    if (labelElement && previousLabel) labelElement.textContent = previousLabel;
  }, 1100);
}

function getPreferredTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
