const tiltCards = document.querySelectorAll("[data-tilt]");

for (const card of tiltCards) {
  const baseTransform = getComputedStyle(card).transform === "none" ? "" : getComputedStyle(card).transform;

  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateX = y * -5;
    const rotateY = x * 5;

    card.style.transform = `${baseTransform} perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = baseTransform;
  });
}

const faqItems = document.querySelectorAll(".faq-grid details");

for (const item of faqItems) {
  const summary = item.querySelector("summary");
  summary?.addEventListener("click", (event) => {
    event.preventDefault();
    const shouldOpen = !item.open;
    for (const other of faqItems) {
      other.open = false;
    }
    item.open = shouldOpen;
  });
}

const whatsappButton = document.querySelector(".whatsapp-float");
const protectedSections = document.querySelectorAll(".notification-section, .pricing, .final-cta, .site-footer");

const header = document.querySelector(".site-header");
const internalLinks = document.querySelectorAll('a[href^="#"]');

function getAnchorTarget(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.querySelector(hash);
  } catch {
    return null;
  }
}

function getAnchorTop(target) {
  if (target.id === "top") return 0;

  const heading = target.querySelector(".eyebrow") || target.querySelector("h1, h2") || target;
  const headerBottom = header?.getBoundingClientRect().bottom || 0;
  const breathingRoom = window.innerWidth <= 760 ? 24 : 42;
  return Math.max(0, window.scrollY + heading.getBoundingClientRect().top - headerBottom - breathingRoom);
}

function scrollToHash(hash, behavior = "smooth") {
  const target = getAnchorTarget(hash);
  if (!target) return false;
  window.scrollTo({ top: getAnchorTop(target), behavior });
  return true;
}

for (const link of internalLinks) {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!scrollToHash(hash)) return;
    event.preventDefault();
    history.pushState(null, "", hash);
  });
}

window.addEventListener("popstate", () => scrollToHash(window.location.hash));

if (window.location.hash) {
  window.addEventListener("load", () => {
    requestAnimationFrame(() => scrollToHash(window.location.hash, "auto"));
  }, { once: true });
}

if (whatsappButton && protectedSections.length && "IntersectionObserver" in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    }
    whatsappButton.classList.toggle("is-hidden", visibleSections.size > 0);
  }, { threshold: 0.08 });

  for (const section of protectedSections) observer.observe(section);
}
