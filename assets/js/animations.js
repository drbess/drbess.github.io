import { animate, stagger, inView } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cubicOut = [0.25, 0.1, 0.25, 1];

// ── Theme toggle ────────────────────────────────
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const stored = localStorage.getItem("theme");
if (stored === "light" || stored === "dark") {
  root.setAttribute("data-theme", stored);
}
toggle?.addEventListener("click", () => {
  const current =
    root.getAttribute("data-theme") ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  if (!reduceMotion) {
    animate(toggle, { rotate: [0, 360] }, { duration: 0.5, easing: cubicOut });
  }
});

// Skip the rest if user prefers reduced motion
if (reduceMotion) {
  document.querySelectorAll(
    "#site-header, .hero, .section, .skill-card, .project-card, .article-card"
  ).forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
} else {
  // ── Header slides down ─────────────────────────
  animate(
    "#site-header",
    { opacity: [0, 1], y: [-20, 0] },
    { duration: 0.5, easing: "ease-out" }
  );

  // ── Hero entrance: avatar pops, then text cascades ─────
  animate(
    ".hero",
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.6, delay: 0.15, easing: cubicOut }
  );
  animate(
    ".hero-avatar",
    { opacity: [0, 1], scale: [0.6, 1] },
    { duration: 0.7, delay: 0.25, easing: [0.34, 1.56, 0.64, 1] }
  );
  animate(
    ".hero-name, .hero-title, .hero-tagline, .hero-cta",
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.5, delay: stagger(0.1, { start: 0.4 }), easing: cubicOut }
  );

  // ── Sections fade up on scroll ─────────────────
  inView(".section", ({ target }) => {
    animate(
      target,
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.55, easing: "ease-out" }
    );
  });

  // ── Skill cards stagger ────────────────────────
  inView("#skills", () => {
    animate(
      ".skill-card",
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, delay: stagger(0.07, { start: 0.1 }), easing: "ease-out" }
    );
  });

  // ── Project cards stagger ──────────────────────
  inView("#projects", () => {
    animate(
      ".project-card",
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.45, delay: stagger(0.1, { start: 0.1 }), easing: "ease-out" }
    );
  });

  // ── Article cards stagger ──────────────────────
  inView("#articles", () => {
    animate(
      ".article-card",
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, delay: stagger(0.08, { start: 0.1 }), easing: "ease-out" }
    );
  });
}
