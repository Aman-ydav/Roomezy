let deferredPrompt = null;

// ---- COUNT VISITS ----
function shouldShowPopup() {
  const count = Number(localStorage.getItem("roomezy_visits") || 0) + 1;
  localStorage.setItem("roomezy_visits", count);

  // Show only every Xth visit
  return count % 2 === 0;
}

// ---- LISTEN FOR INSTALL EVENT ----
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (shouldShowPopup()) {
    const popup = document.getElementById("installPopup");
    if (popup) popup.classList.add("show-popup");
  }
});

// ---- INSTALL FUNCTION ----
export const installRoomezy = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;

  document.getElementById("installPopup")?.classList.remove("show-popup");
};
