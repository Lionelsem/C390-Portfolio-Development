function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 80;
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

  window.scrollTo({ top, behavior: "smooth" });
}

let projects = [];

let currentProjectIndex = 0;
let activeCategory = "All";

// Elements
const projectFiltersEl = document.getElementById("projectFilters");
const projectsGridEl = document.getElementById("projectsGrid");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("projModalTitle");
const modalBody = document.getElementById("projModalBody");
const modalMedia = document.getElementById("projModalMedia");
const modalWriteup = document.getElementById("projModalWriteup");
const modalLink = document.getElementById("projModalLink");
const projectCountEl = document.getElementById("projectCount");

function getAllCategories() {
  const set = new Set();
  projects.forEach((p) => {
    (p.categories || []).forEach((cat) => set.add(cat));
  });
  return ["All", ...Array.from(set).sort()];
}

function renderFilters() {
  if (!projectFiltersEl) return;
  projectFiltersEl.innerHTML = "";
  const categories = getAllCategories();

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "project-filter-btn";
    btn.textContent = cat;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", cat === activeCategory ? "true" : "false");
    if (cat === activeCategory) btn.classList.add("is-active");
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderProjects();
    });
    projectFiltersEl.appendChild(btn);
  });
}

function renderProjects() {
  if (!projectsGridEl) return;
  projectsGridEl.innerHTML = "";

  const filtered = projects.filter((p) => {
    if (activeCategory === "All") return true;
    return (p.categories || []).includes(activeCategory);
  });

  filtered.forEach((p) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const tags = (p.categories || [])
      .map((cat) => `<span class="project-tag">${cat}</span>`)
      .join("");

    const imgClass = p.fit === "contain" ? "fit-contain" : "";
    const linkHtml = p.link
      ? `<a class="btn outline-btn project-link" href="${p.link}" target="_blank" rel="noopener">Open Project</a>`
      : `<span class="project-link-disabled">No public link</span>`;

    card.innerHTML = `
      <div class="project-card-media">
        <img src="${p.image}" alt="${p.title} preview" class="${imgClass}" />
        <button class="proj-more" type="button" data-project-index="${projects.indexOf(p)}">Click more</button>
      </div>
      <div class="project-card-body">
        <div class="project-tags">${tags}</div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.desc}</p>
        <div class="project-card-meta">
          <div class="project-card-row">
            <span class="proj-label">Stack</span>
            <span class="proj-value">${p.stack}</span>
          </div>
          <div class="project-card-row">
            <span class="proj-label">Focus</span>
            <span class="proj-value">${p.focus}</span>
          </div>
        </div>
        <div class="project-card-actions">
          ${linkHtml}
        </div>
      </div>
    `;

    projectsGridEl.appendChild(card);
  });
}

function renderModalMedia(project) {
  if (!modalMedia) return;
  modalMedia.innerHTML = "";
  if (!project.video || !project.video.src) {
    modalMedia.classList.add("is-hidden");
    return;
  }

  modalMedia.classList.remove("is-hidden");
  if (project.video.type === "youtube") {
    const iframe = document.createElement("iframe");
    iframe.src = project.video.src;
    iframe.title = `${project.title} video`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    modalMedia.appendChild(iframe);
  } else if (project.video.type === "mp4") {
    const video = document.createElement("video");
    video.src = project.video.src;
    video.controls = true;
    video.playsInline = true;
    modalMedia.appendChild(video);
  }
}

function renderModalWriteup(project) {
  if (!modalWriteup) return;
  modalWriteup.innerHTML = "";

  if (!project.writeup || !project.writeup.length) {
    modalWriteup.classList.add("is-hidden");
    return;
  }

  modalWriteup.classList.remove("is-hidden");
  const heading = document.createElement("h4");
  heading.textContent = "Writeup";
  const list = document.createElement("ul");
  project.writeup.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  modalWriteup.appendChild(heading);
  modalWriteup.appendChild(list);
}

function openModal(index) {
  const p = projects[index];
  if (!p || !modal) return;
  currentProjectIndex = index;

  modalTitle.textContent = p.title;
  modalBody.textContent = p.more || p.desc;
  renderModalMedia(p);
  renderModalWriteup(p);

  if (modalLink) {
    modalLink.href = p.link || "#";
    modalLink.classList.toggle("is-disabled", !p.link);
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

if (projectsGridEl) {
  projectsGridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-project-index]");
    if (!btn) return;
    const index = Number(btn.dataset.projectIndex);
    if (Number.isNaN(index)) return;
    openModal(index);
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-close-modal")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

if (modalLink) {
  modalLink.addEventListener("click", (e) => {
    const p = projects[currentProjectIndex];
    if (p && p.link) return;
    e.preventDefault();
  });
}

async function loadProjects() {
  try {
    const res = await fetch("/data/projects.json");
    if (!res.ok) throw new Error("Failed to load projects.json");
    const data = await res.json();
    projects = Array.isArray(data) ? data : [];
    return true;
  } catch (err) {
    console.error("Projects load error:", err);
    projects = [];
    return false;
  }
}

function updateProjectCount() {
  if (!projectCountEl) return;
  projectCountEl.textContent = String(projects.length);
  const stat = projectCountEl.closest(".stat-value");
  if (stat) {
    stat.classList.remove("is-flipping");
    void stat.offsetWidth;
    stat.classList.add("is-flipping");
  }
}

async function initProjects() {
  const loaded = await loadProjects();
  renderFilters();
  renderProjects();
  if (loaded && projects.length) {
    updateProjectCount();
  }
}

initProjects();

function initCertCarousel() {
  const track = document.getElementById("certTrack");
  const prev = document.querySelector(".cert-prev");
  const next = document.querySelector(".cert-next");
  if (!track || !prev || !next) return;

  const getStep = () => {
    const firstCard = track.querySelector(".cert-card");
    if (!firstCard) return 280;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });
}

initCertCarousel();

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
