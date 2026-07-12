import { MOTION } from "./constants.js";

const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

export function haptic(type = "selection") {
  const patterns = {
    selection: 8,
    success: [10, 30, 12],
    warning: [18, 40, 18],
    error: [25, 45, 25]
  };
  if ("vibrate" in navigator) {
    try { navigator.vibrate(patterns[type] ?? patterns.selection); } catch {}
  }
}

export function animateNumber(element, endValue, formatter, duration = MOTION.number) {
  if (!element || element.dataset.animating === "true") return;
  element.dataset.animating = "true";
  if (reducedMotion()) {
    element.textContent = formatter(endValue);
    return;
  }
  const start = performance.now();
  const from = Number(element.dataset.value || 0);
  const delta = endValue - from;

  const frame = now => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + delta * eased;
    element.textContent = formatter(value);
    if (progress < 1) requestAnimationFrame(frame);
    else {
      element.dataset.value = String(endValue);
      element.dataset.animating = "false";
    }
  };
  requestAnimationFrame(frame);
}

export function showToast(message, tone = "neutral") {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = `toast toast-${tone}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), MOTION.toast);
  }, 1800);
}

export function enterPage(container) {
  if (!container || reducedMotion()) return;
  container.classList.remove("page-enter");
  void container.offsetWidth;
  container.classList.add("page-enter");
}

export function animateLoanFills() {
  document.querySelectorAll(".loan-strip").forEach(strip => {
    const target = strip.style.getPropertyValue("--loan-visual-end") || "0%";
    strip.style.setProperty("--loan-animated-end", "0%");
    requestAnimationFrame(() => {
      strip.style.setProperty("--loan-animated-end", target);
      setTimeout(() => strip.dataset.animated = "true", 560);
    });
  });
}

export function bindPressFeedback(root = document) {
  root.querySelectorAll("button, .card[data-loan], .page-row[data-loan]").forEach(element => {
    if (element.dataset.pressBound) return;
    element.dataset.pressBound = "true";

    const press = () => element.classList.add("is-pressed");
    const release = () => element.classList.remove("is-pressed");

    element.addEventListener("touchstart", press, { passive: true });
    element.addEventListener("touchend", release, { passive: true });
    element.addEventListener("touchcancel", release, { passive: true });
    element.addEventListener("mousedown", press);
    element.addEventListener("mouseup", release);
    element.addEventListener("mouseleave", release);
  });
}


export function staggerRows(root = document) {
  if (reducedMotion()) return;
  root.querySelectorAll(".transaction-row, .loan-strip").forEach((element, index) => {
    element.style.setProperty("--stagger-index", String(Math.min(index, 10)));
    element.classList.add("stagger-enter");
  });
}
