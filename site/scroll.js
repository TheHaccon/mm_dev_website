(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;

  const stage = document.querySelector("[data-flip-stage]");
  const pin = document.querySelector("[data-flip-pin]");
  const flipper = document.querySelector("[data-flip-card]");
  const site = document.querySelector("[data-flip-site]");
  const footer = document.querySelector(".legal");
  const hint = document.querySelector("[data-flip-hint]");
  if (!stage || !pin || !flipper || !site) return;

  document.documentElement.classList.add("has-flip");

  const back = document.createElement("div");
  back.className = "face face-back";
  const inner = document.createElement("div");
  inner.className = "site-inner";
  inner.append(site);
  if (footer) inner.append(footer);
  back.append(inner);
  flipper.append(back);

  const html = document.documentElement;
  const ease = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  let cardW = 0;
  let cardH = 0;
  let flipDist = 0;
  let innerDist = 0;

  const measureCard = () => {
    const width = flipper.style.width;
    const height = flipper.style.height;
    const radius = flipper.style.borderRadius;
    flipper.style.width = "";
    flipper.style.height = "";
    flipper.style.borderRadius = "";
    const rect = flipper.getBoundingClientRect();
    cardW = rect.width;
    cardH = rect.height;
    flipper.style.width = width;
    flipper.style.height = height;
    flipper.style.borderRadius = radius;
  };

  const layout = () => {
    const pinH = pin.clientHeight;
    const pinW = pin.clientWidth;
    inner.style.width = `${pinW}px`;
    measureCard();
    flipDist = Math.round(pinH * 1.2);
    innerDist = Math.max(0, inner.scrollHeight - pinH);
    stage.style.height = `${pinH + flipDist + innerDist}px`;
  };

  const update = () => {
    const pinH = pin.clientHeight;
    const pinW = pin.clientWidth;
    const scrolled = clamp(
      -stage.getBoundingClientRect().top,
      0,
      flipDist + innerDist
    );

    const t = clamp(scrolled / Math.max(flipDist, 1), 0, 1);
    const angle = ease(t) * 180;
    const length = ease(t);
    const widen = ease(clamp((t - 0.42) / 0.58, 0, 1));
    const innerY = scrolled > flipDist ? scrolled - flipDist : 0;

    const lift = Math.sin((angle / 180) * Math.PI) * 40;
    flipper.style.transform = `translateZ(${lift}px) rotate3d(1, 1, 0, ${angle}deg)`;
    flipper.style.width = `${lerp(cardW, pinW, widen)}px`;
    flipper.style.height = `${lerp(cardH, pinH, length)}px`;
    flipper.style.borderRadius = `${lerp(24, 0, length)}px`;
    flipper.style.boxShadow = t > 0.9 ? "none" : "";
    flipper.style.aspectRatio = t > 0.02 ? "auto" : "";

    const preview = pinW > 0 ? lerp(cardW / pinW, 1, widen) : 1;
    inner.style.transform = `translateX(-50%) translateY(${-innerY}px) scale(${preview})`;

    if (hint) {
      hint.style.opacity = String(clamp(1 - t * 4, 0, 1));
      hint.style.pointerEvents = t > 0.08 ? "none" : "";
    }
  };

  let ticking = false;
  let buttonAnim = 0;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  const setScrollTop = (y) => {
    html.scrollTop = y;
    document.body.scrollTop = y;
    window.scrollTo({ top: y, left: 0, behavior: "auto" });
  };

  const stopButtonAnim = (event) => {
    if (event && hint && hint.contains(event.target)) return;
    if (buttonAnim === 0) return;
    buttonAnim += 1;
    html.style.scrollBehavior = "";
  };

  const scrollFlipWithButton = (duration) => {
    const start = window.scrollY || html.scrollTop;
    const dest = flipDist;
    const delta = dest - start;
    if (delta < 1) return;

    const id = ++buttonAnim;
    const t0 = performance.now();
    html.style.scrollBehavior = "auto";

    const step = (now) => {
      if (id !== buttonAnim) return;
      const p = Math.min(1, (now - t0) / duration);
      setScrollTop(start + delta * ease(p));
      update();
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        html.style.scrollBehavior = "";
      }
    };

    requestAnimationFrame(step);
  };

  if (hint) {
    hint.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      scrollFlipWithButton(3000);
    });
  }

  layout();
  update();

  window.addEventListener("wheel", stopButtonAnim, { passive: true });
  window.addEventListener("touchmove", stopButtonAnim, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "PageDown" ||
      event.key === "PageUp" ||
      event.key === "Home" ||
      event.key === "End" ||
      event.key === " "
    ) {
      stopButtonAnim(event);
    }
  });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    layout();
    update();
  });
})();
