let deferredInstallPrompt = null;

export function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
}

export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function canPromptInstall() {
  return Boolean(deferredInstallPrompt);
}

export function installState() {
  return {
    standalone: isStandalone(),
    ios: isIOS(),
    canPrompt: canPromptInstall()
  };
}

export async function requestInstall({ showIOSHelp } = {}) {
  if (isStandalone()) return { status: "installed" };

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === "accepted") deferredInstallPrompt = null;
    return { status: choice.outcome };
  }

  if (isIOS() && typeof showIOSHelp === "function") {
    showIOSHelp();
    return { status: "instructions" };
  }

  return { status: "unavailable" };
}

export function initPWA({ onStateChange } = {}) {
  document.documentElement.classList.toggle("is-standalone", isStandalone());

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    onStateChange?.(installState());
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    document.documentElement.classList.add("is-standalone");
    onStateChange?.(installState());
  });

  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener?.("change", () => {
    document.documentElement.classList.toggle("is-standalone", isStandalone());
    onStateChange?.(installState());
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
        registration.update().catch(() => {});
      } catch (error) {
        console.warn("FinanceOS Service Worker konnte nicht registriert werden.", error);
      }
    });
  }

  return installState();
}
