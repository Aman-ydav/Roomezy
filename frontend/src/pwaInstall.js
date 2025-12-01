let deferredPrompt = null;


function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
    navigator.userAgent
  );
}

// ---- COUNT VISITS ----
function shouldShowPopup() {
  const count = Number(localStorage.getItem("roomezy_visits") || 0) + 1;
  localStorage.setItem("roomezy_visits", count);

  // Show only every 10th visit
  return count % 10 === 0;
}

// ---- LISTEN FOR INSTALL EVENT ----
window.addEventListener("beforeinstallprompt", (e) => {
  // Block default
  e.preventDefault();
  deferredPrompt = e;


  if (!isMobile()) return;

  // ✔ Show popup ONLY on mobile + only every 10th visit
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
