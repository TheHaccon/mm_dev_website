(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const topbar = document.querySelector("[data-topbar]");
  const hero = document.querySelector("[data-hero]");
  const menuBtn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");
  const root = document.scrollingElement || document.documentElement;
  const desktop = window.matchMedia("(min-width: 52rem)");

  const setMenuOpen = (open) => {
    if (!topbar || !menuBtn) return;
    const next = Boolean(open) && !desktop.matches;
    topbar.classList.toggle("is-open", next);
    menuBtn.setAttribute("aria-expanded", String(next));
    document.documentElement.classList.toggle("is-menu-open", next);
    const label = next
      ? menuBtn.getAttribute("data-label-close")
      : menuBtn.getAttribute("data-label-open");
    if (label) menuBtn.setAttribute("aria-label", label);
  };

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      setMenuOpen(!topbar.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
    document.addEventListener("click", (event) => {
      if (!topbar.contains(event.target)) setMenuOpen(false);
    });
    desktop.addEventListener("change", () => setMenuOpen(false));
  }

  if (topbar && hero) {
    const onHero = new IntersectionObserver(
      ([entry]) => {
        topbar.classList.toggle("is-on", !entry.isIntersecting);
      },
      { threshold: 0.18 }
    );
    onHero.observe(hero);
  }

  const ease = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const scrollDownTo = (el, duration) => {
    const header = topbar ? topbar.offsetHeight : 66;
    const dest = Math.max(
      0,
      el.getBoundingClientRect().top + root.scrollTop - header - 16
    );
    const start = root.scrollTop;
    const delta = dest - start;
    if (Math.abs(delta) < 2) return;

    document.documentElement.classList.add("is-scrolling");
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      root.scrollTop = start + delta * ease(p);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        document.documentElement.classList.remove("is-scrolling");
      }
    };

    requestAnimationFrame(step);
  };

  document.querySelectorAll("[data-scroll-down]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      if (reduce) {
        target.scrollIntoView();
        return;
      }
      scrollDownTo(target, 1500);
    });
  });

  if (reduce) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-in");
    });
    return;
  }

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        reveal.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
})();
