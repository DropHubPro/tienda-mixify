document.addEventListener("DOMContentLoaded", () => {
  // Load header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("/components/header.html")
      .then((response) => response.text())
      .then((data) => {
        headerPlaceholder.innerHTML = data;
      })
      .catch((err) => console.error("Error loading header:", err));
  }

  // Load footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("/components/footer.html")
      .then((response) => response.text())
      .then((data) => {
        footerPlaceholder.innerHTML = data;
      })
      .catch((err) => console.error("Error loading footer:", err));
  }
});
