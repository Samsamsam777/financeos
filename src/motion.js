import { MOTION } from "./constants.js";

const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

export function haptic(type = "selection") {
  const patterns = {
    selection: 8,
    light: 8,
    medium: [10, 22, 10],
    success: [10, 28, 12],
    warning: [18, 38, 18],
    error: [24, 42, 24]
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
    element.dataset.value = String(endValue);
    element.dataset.animating = "false";
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
  document.querySelectorAll(".slim-progress-fill").forEach(fill => {
    fill.classList.remove("is-visible");
    requestAnimationFrame(() => fill.classList.add("is-visible"));
  });
}

export function bindPressFeedback(root = document) {
  root.querySelectorAll("button, .card[data-loan], .page-row[data-loan], .transaction-row[data-transaction]").forEach(element => {
    if (element.dataset.pressBound) return;
    element.dataset.pressBound = "true";

    const press = () => {
      element.classList.remove("is-released");
      element.classList.add("is-pressed");
      if (element.classList.contains("plus")) haptic("light");
    };

    const release = () => {
      const wasPressed = element.classList.contains("is-pressed");
      element.classList.remove("is-pressed");
      if (!wasPressed) return;
      element.classList.add("is-released");
      setTimeout(() => element.classList.remove("is-released"), 360);
    };

    element.addEventListener("pointerdown", press, { passive: true });
    element.addEventListener("pointerup", release, { passive: true });
    element.addEventListener("pointercancel", release, { passive: true });
    element.addEventListener("pointerleave", release, { passive: true });
  });

  root.querySelectorAll(".transaction-row, .grouped-row").forEach((element, index) => {
    element.style.setProperty("--stagger-index", String(Math.min(index, 12)));
    element.classList.add("stagger-item");
  });
}
