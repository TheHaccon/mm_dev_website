(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const topbar = document.querySelector("[data-topbar]");
  const hero = document.querySelector("[data-hero]");
  const root = document.scrollingElement || document.documentElement;

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
