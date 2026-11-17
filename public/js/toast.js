document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast-message");

  if (toast) {
    window.history.replaceState(null, "", window.location.pathname);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }
});
