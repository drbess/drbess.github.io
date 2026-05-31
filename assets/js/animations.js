const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Theme toggle (always works, no dependencies) ──
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
});

// Reveal everything if the user prefers reduced motion (CSS rule never
// applied anyway because the head script gates .js-anim on the same query,
// but this is belt-and-suspenders).
if (reduceMotion) {
  root.classList.remove("js-anim");
} else {
  // Fail-safe: if Motion fails to load or any animation throws, strip
  // .js-anim after 2.5s so content reveals via natural CSS.
  const safetyTimer = setTimeout(() => root.classList.remove("js-anim"), 2500);

  try {
    const { animate, stagger, inView } = await import(
      "https://cdn.jsdelivr.net/npm/motion@11/+esm"
    );

    const cubicOut = [0.25, 0.1, 0.25, 1];

    // Header
    animate(
      "#site-header",
      { opacity: [0, 1], y: [-20, 0] },
      { duration: 0.5, ease: "easeOut" }
    );

    // Hero
    animate(
      ".hero",
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.6, delay: 0.15, ease: cubicOut }
    );
    animate(
      ".hero-avatar",
      { opacity: [0, 1], scale: [0.6, 1] },
      { duration: 0.7, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }
    );
    animate(
      ".hero-name, .hero-title, .hero-tagline, .hero-cta",
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.5, delay: stagger(0.1, { start: 0.4 }), ease: cubicOut }
    );

    // Sections fade up on entry
    inView(".section", (entry) => {
      const el = entry.target ?? entry;
      animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.55, ease: "easeOut" });
    });

    // Card staggers per section
    inView("#skills", () => {
      animate(
        ".skill-card",
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, delay: stagger(0.07, { start: 0.1 }), ease: "easeOut" }
      );
    });
    inView("#projects", () => {
      animate(
        ".project-card",
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.45, delay: stagger(0.1, { start: 0.1 }), ease: "easeOut" }
      );
    });
    inView("#articles", () => {
      animate(
        ".article-card",
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, delay: stagger(0.08, { start: 0.1 }), ease: "easeOut" }
      );
    });

    // Animations registered successfully — let the safety timer still fire
    // so anything that didn't trigger (e.g. inView never fires for a card)
    // still reveals.
    void safetyTimer;
  } catch (err) {
    console.error("Motion failed to load; revealing content immediately.", err);
    clearTimeout(safetyTimer);
    root.classList.remove("js-anim");
  }
}
