import { animate, stagger, inView } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

// Header slides down on load
animate(
  "#site-header",
  { opacity: [0, 1], y: [-20, 0] },
  { duration: 0.5, easing: "ease-out" }
);

// Hero fades up on load (slight delay so header lands first)
animate(
  ".hero",
  { opacity: [0, 1], y: [30, 0] },
  { duration: 0.65, delay: 0.2, easing: [0.25, 0.1, 0.25, 1] }
);

// Sections fade up as they scroll into view
inView(".section", ({ target }) => {
  animate(
    target,
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.55, easing: "ease-out" }
  );
});

// Skill cards stagger in when section enters view
inView("#skills", () => {
  animate(
    ".skill-card",
    { opacity: [0, 1], y: [20, 0] },
    { duration: 0.4, delay: stagger(0.08, { start: 0.1 }), easing: "ease-out" }
  );
});

// Project cards stagger in when section enters view
inView("#projects", () => {
  animate(
    ".project-card",
    { opacity: [0, 1], y: [20, 0] },
    { duration: 0.4, delay: stagger(0.1, { start: 0.1 }), easing: "ease-out" }
  );
});
