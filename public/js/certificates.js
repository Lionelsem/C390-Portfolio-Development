const filterButtons = document.querySelectorAll("[data-filter]");
const certCards = document.querySelectorAll(".cert-card");

function normalizeIssuer(issuer) {
  return issuer.toLowerCase().replace(/\s+/g, "-");
}

function setActiveButton(activeBtn) {
  filterButtons.forEach((btn) => {
    const isActive = btn === activeBtn;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function applyFilter(filterValue) {
  certCards.forEach((card) => {
    const issuer = card.getAttribute("data-issuer") || "";
    const normalized = normalizeIssuer(issuer);
    const show = filterValue === "all" || normalized === filterValue;
    card.style.display = show ? "" : "none";
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filterValue = btn.getAttribute("data-filter");
    setActiveButton(btn);
    applyFilter(filterValue);
  });
});
