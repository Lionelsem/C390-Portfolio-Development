function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 80;
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

  window.scrollTo({ top, behavior: "smooth" });
}

const projects = [
  {
    title: "Guess The Country Capital",
    stack: "React / Expo / JavaScript / Picker DropDown / React Hooks",
    focus: "Mobile interface",
    desc: "A quiz app to test knowledge of world capitals.",
    more: "This project focuses on mobile interface design, responsive layouts, and interactive elements.",
    image: "/img/GuessTheCountry.png",
    fit: "contain",
    link: "https://github.com/Lionelsem/c346-lesson08-Lionelsem-v3",
  },
  {
    title: "Sustainable Clothing Website",
    stack: "Figma",
    focus: "User flow and wireframes",
    desc: "A website promoting sustainable clothing choices.",
    more:
      "This project focuses on user flow design, wireframes, and key screens such as home, explore, saved places, and trip planner.",
    image: "/img/SustainabilityClothingWebsite.png",
    link: "https://www.figma.com/design/wDS3rS6v826ypmqdC4c6cQ/CA1?node-id=0-1&t=hDusctz4T95YtI1H-1",
  },
  {
    title: "Hawker Hero",
    stack: "Java / EJS",
    focus: "Branding and e-commerce UI",
    desc: "A recommendation and rating platform for local food stalls.",
    more:
      "This project emphasizes branding, product listing, filtering, and a smooth checkout process with a focus on user trust and ease of use.",
    image: "/img/Hawker.png",
    link: "https://github.com/teaonrocks/hawker-hero",
  },
    {
    title: "Escape Room",
    stack: "Unity / C#",
    focus: "VR Game Design",
    desc: "A virtual reality escape room game.",
    more:
      "This project focuses on immersive VR environments, interactive puzzles, and user engagement through storytelling.",
    image: "/img/EscapeRoom.png",
  },

    {
    title: "FoodWaste Tracker",
    stack: "Java /Express/ React",
    focus: "Full-stack development mobile app",
    desc: "An app to track and reduce food waste.",
    more:
      "Built a full-stack, mobile-responsive app with data visualizations as part of a team project.",
    image: "/img/FoodWaste.png",
    link: "https://github.com/C346-AY2025-002/c346-ca2-ca2_team9",
    fit: "contain",

  },
    {
    title: "Learn@RP",
    stack: "Figma",
    focus: "UI/UX Design",
    desc: "A redesign of the Learn@RP platform for better user experience.",
    more:
      "This project focuses on improving navigation, accessibility, and overall user satisfaction through thoughtful UI/UX design.",
    image: "/img/Learn@RP.png",
    link: "https://www.figma.com/design/r94pEDlWEu3tiGDRiGIxCO/CA2?node-id=15-12&t=Nd4d3ByTEjrHtgcB-1",
  },
    {
    title: "Income Expense Tracker",
    stack: "React Native / Expo / JavaScript",
    focus: "Mobile App Development",
    desc: "An app to track personal income and expenses.",
    more:
      "This project focuses on mobile app development, user-friendly interfaces, and efficient data management.",
    image: "/img/IncomeTracker.png",
    link: "https://github.com/C346-AY2025-002/c346-ca1-Lionelsem?tab=readme-ov-file",
    fit: "contain",
  },
];

let currentProjectIndex = 0;

// Elements
const elImg = document.getElementById("projectImage");
const elTitle = document.getElementById("projectTitle");
const elStack = document.getElementById("projectStack");
const elFocus = document.getElementById("projectFocus");
const elDesc = document.getElementById("projectDesc");
const elLink = document.getElementById("projectLink");

const btnPrev = document.getElementById("projPrev");
const btnNext = document.getElementById("projNext");
const btnMore = document.getElementById("projectMoreBtn");

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("projModalTitle");
const modalBody = document.getElementById("projModalBody");
const modalLink = document.getElementById("projModalLink");
const projectCountEl = document.getElementById("projectCount");

function renderProject(i) {
  const p = projects[i];
  if (!p || !elImg) return;

  elImg.src = p.image;
  elImg.alt = `${p.title} preview`;
  elImg.classList.toggle("fit-contain", p.fit === "contain");

  elTitle.textContent = p.title;
  elStack.textContent = p.stack;
  elFocus.textContent = p.focus;
  elDesc.textContent = p.desc;

  const linkValue = p.link || "";
  elLink.href = linkValue || "#";
  modalLink.href = linkValue || "#";

  elLink.dataset.hasLink = linkValue ? "true" : "false";
  modalLink.dataset.hasLink = linkValue ? "true" : "false";
}

function animateProjectChange() {
  const card = document.querySelector(".proj-card");
  if (!card) return;
  card.classList.add("is-transitioning");
  window.setTimeout(() => {
    card.classList.remove("is-transitioning");
  }, 350);
}

function openModal() {
  const p = projects[currentProjectIndex];
  if (!modal) return;

  modalTitle.textContent = p.title;
  modalBody.textContent = p.more;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// Events
if (btnPrev && btnNext) {
  btnPrev.addEventListener("click", () => {
    currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
    animateProjectChange();
    renderProject(currentProjectIndex);
  });

  btnNext.addEventListener("click", () => {
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
    animateProjectChange();
    renderProject(currentProjectIndex);
  });
}

if (btnMore) btnMore.addEventListener("click", openModal);

function handleProjectLinkClick(e) {
  const p = projects[currentProjectIndex];
  if (!p || p.link) return;
  e.preventDefault();
  alert("This project is not on GitHub.");
}

if (elLink) elLink.addEventListener("click", handleProjectLinkClick);
if (modalLink) modalLink.addEventListener("click", handleProjectLinkClick);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-close-modal")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

renderProject(currentProjectIndex);

if (projectCountEl) {
  projectCountEl.textContent = String(projects.length);
  const stat = projectCountEl.closest(".stat-value");
  if (stat) {
    stat.classList.remove("is-flipping");
    void stat.offsetWidth;
    stat.classList.add("is-flipping");
  }
}

// Auto-advance projects every 2 seconds
const autoAdvanceMs = 5000;
let autoAdvanceTimer = null;

function startAutoAdvance() {
  if (!projects.length) return;
  stopAutoAdvance();
  autoAdvanceTimer = window.setInterval(() => {
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
    animateProjectChange();
    renderProject(currentProjectIndex);
  }, autoAdvanceMs);
}

function stopAutoAdvance() {
  if (autoAdvanceTimer) {
    window.clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

startAutoAdvance();

// Arrow keys to change projects
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
    animateProjectChange();
    renderProject(currentProjectIndex);
    startAutoAdvance();
  }
  if (e.key === "ArrowRight") {
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
    animateProjectChange();
    renderProject(currentProjectIndex);
    startAutoAdvance();
  }
});

const loader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
  if (!loader) return;
  const minDisplayMs = 1200;

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");

    const cleanupDelayMs = 450;
    window.setTimeout(() => {
      loader.remove();
    }, cleanupDelayMs);
  }, minDisplayMs);
});

const statValues = document.querySelectorAll(".stat-value");
statValues.forEach((stat) => {
  stat.classList.remove("is-flipping");
  void stat.offsetWidth;
  stat.classList.add("is-flipping");
});
