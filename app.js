const cards = Array.from(document.querySelectorAll(".pandit-card"));
const ceremonyFilter = document.getElementById("filter-ceremony");
const languageFilter = document.getElementById("filter-language");
const cityFilter = document.getElementById("filter-city");
const resultCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const savedToggle = document.getElementById("saved-toggle");
const savedCount = document.getElementById("saved-count");
const toast = document.getElementById("toast");
const bookingDialog = document.getElementById("booking-dialog");
const bookingForm = document.getElementById("booking-form");
const bookingPanel = document.getElementById("booking-panel");
const bookingSuccess = document.getElementById("booking-success");
const bookingDate = document.getElementById("booking-date");
let showingSavedOnly = false;
let toastTimer;

const normalize = (value) => value.trim().toLocaleLowerCase();
let savedProfiles = new Set();
try {
  const saved = JSON.parse(localStorage.getItem("mister-pandit-saved") || "[]");
  if (Array.isArray(saved)) savedProfiles = new Set(saved);
} catch {
  savedProfiles = new Set();
}

function updateSavedButtons() {
  cards.forEach((card) => {
    const button = card.querySelector(".save-button");
    const isSaved = savedProfiles.has(card.dataset.name);
    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    button.textContent = isSaved ? "♥" : "♡";
    button.setAttribute(
      "aria-label",
      (isSaved ? "Remove " : "Save ") + card.dataset.name,
    );
  });
  savedCount.textContent = String(savedProfiles.size);
  savedToggle.setAttribute("aria-pressed", String(showingSavedOnly));
}

function applyFilters() {
  const ceremony = ceremonyFilter.value;
  const language = languageFilter.value;
  const city = normalize(cityFilter.value);
  let visible = 0;
  cards.forEach((card) => {
    const matchesCeremony =
      !ceremony || card.dataset.ceremonies.split(" ").includes(ceremony);
    const matchesLanguage =
      !language || card.dataset.language.split(" ").includes(language);
    const matchesCity = !city || card.dataset.city.includes(city);
    const matchesSaved =
      !showingSavedOnly || savedProfiles.has(card.dataset.name);
    const matches =
      matchesCeremony && matchesLanguage && matchesCity && matchesSaved;
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  resultCount.textContent = visible + (visible === 1 ? " pandit" : " pandits");
  emptyState.hidden = visible !== 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function openBooking(panditName, ceremonyValue) {
  bookingForm.reset();
  document.getElementById("booking-pandit").value = panditName || "";
  if (ceremonyValue)
    document.getElementById("booking-ceremony").value = ceremonyValue;
  document.getElementById("booking-city").value =
    document.getElementById("quick-city").value || cityFilter.value;
  bookingPanel.hidden = false;
  bookingSuccess.hidden = true;
  bookingDialog.showModal();
  window.setTimeout(() => document.getElementById("booking-name").focus(), 30);
}

cards.forEach((card) => {
  card.querySelector(".save-button").addEventListener("click", () => {
    const name = card.dataset.name;
    if (savedProfiles.has(name)) {
      savedProfiles.delete(name);
      showToast("Removed from your saved profiles.");
    } else {
      savedProfiles.add(name);
      showToast("Saved for a little later.");
    }
    try {
      localStorage.setItem(
        "mister-pandit-saved",
        JSON.stringify(Array.from(savedProfiles)),
      );
    } catch {
      showToast("Saved for this visit.");
    }
    updateSavedButtons();
    applyFilters();
  });
  card.querySelector(".book-button").addEventListener("click", (event) => {
    openBooking(event.currentTarget.dataset.bookPandit, ceremonyFilter.value);
  });
});

ceremonyFilter.addEventListener("change", applyFilters);
languageFilter.addEventListener("change", applyFilters);
cityFilter.addEventListener("input", applyFilters);
savedToggle.addEventListener("click", () => {
  showingSavedOnly = !showingSavedOnly;
  updateSavedButtons();
  applyFilters();
  if (showingSavedOnly)
    document
      .getElementById("pandit-grid")
      .scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-ceremony-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    ceremonyFilter.value = button.dataset.ceremonyFilter;
    showingSavedOnly = false;
    updateSavedButtons();
    applyFilters();
    document
      .getElementById("pandits")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.getElementById("search-submit").addEventListener("click", () => {
  ceremonyFilter.value = document.getElementById("quick-ceremony").value;
  cityFilter.value = document.getElementById("quick-city").value;
  showingSavedOnly = false;
  updateSavedButtons();
  applyFilters();
  document
    .getElementById("pandits")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("clear-filters").addEventListener("click", () => {
  ceremonyFilter.value = "";
  languageFilter.value = "";
  cityFilter.value = "";
  document.getElementById("quick-ceremony").value = "";
  document.getElementById("quick-city").value = "";
  showingSavedOnly = false;
  updateSavedButtons();
  applyFilters();
});

document.querySelectorAll("[data-open-booking]").forEach((button) => {
  button.addEventListener("click", () => openBooking("", ceremonyFilter.value));
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => bookingDialog.close());
document
  .getElementById("done-button")
  .addEventListener("click", () => bookingDialog.close());
bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

const today = new Date();
bookingDate.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const formData = new FormData(bookingForm);
  const firstName = String(formData.get("name")).trim().split(/\s+/)[0];
  const ceremony = bookingForm.elements.ceremony.selectedOptions[0].textContent;
  const city = String(formData.get("city")).trim();
  const time = String(formData.get("time"));
  const place = String(formData.get("place"));
  const date = new Date(String(formData.get("date") + "T12:00:00"));
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const panditName = document.getElementById("booking-pandit").value;
  const guideLine = panditName ? " with " + panditName : "";
  document.getElementById("success-message").textContent =
    "Thanks, " +
    firstName +
    ". Your " +
    ceremony +
    " plan" +
    guideLine +
    " for " +
    dateLabel +
    " in " +
    city +
    " (" +
    time.toLowerCase() +
    ", " +
    place.toLowerCase() +
    ")" +
    " is ready to review.";
  bookingPanel.hidden = true;
  bookingSuccess.hidden = false;
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  mainNav.classList.toggle("open", !isOpen);
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

updateSavedButtons();
applyFilters();
