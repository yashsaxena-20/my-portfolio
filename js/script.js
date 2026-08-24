// ══════════════════════════════════════════════════════════
//  INTEGER PARTITION GENERATOR  (hero signature element)
//  Draws a random partition of n as a Young diagram every
//  few seconds — a nod to the partition-theory research
//  mentioned in the About/Experience sections.
// ══════════════════════════════════════════════════════════
(function () {
  const svg = document.getElementById('partitionSvg');
  const caption = document.getElementById('partitionCaption');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const SIZE = 320;
  const CELL = 30;
  const GAP = 6;

  // Generate all partitions of n (small n only — this stays fast)
  function partitions(n, max) {
    max = max || n;
    if (n === 0) return [[]];
    const results = [];
    for (let k = Math.min(n, max); k >= 1; k--) {
      partitions(n - k, k).forEach(rest => results.push([k, ...rest]));
    }
    return results;
  }

  const sequence = [4, 5, 6, 7, 8, 6, 5];
  let seqIndex = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(n) {
    const all = partitions(n);
    const parts = all[Math.floor(Math.random() * all.length)];

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rows = parts.length;
    const cols = parts[0];
    const gridW = cols * CELL + (cols - 1) * GAP;
    const gridH = rows * CELL + (rows - 1) * GAP;
    const offsetX = (SIZE - gridW) / 2;
    const offsetY = (SIZE - gridH) / 2;

    const group = document.createElementNS(NS, 'g');
    group.setAttribute('opacity', '0');

    parts.forEach((rowLen, r) => {
      for (let c = 0; c < rowLen; c++) {
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', offsetX + c * (CELL + GAP));
        rect.setAttribute('y', offsetY + r * (CELL + GAP));
        rect.setAttribute('width', CELL);
        rect.setAttribute('height', CELL);
        rect.setAttribute('rx', 3);
        const isFirstRow = r === 0;
        rect.setAttribute('fill', isFirstRow ? 'rgba(232,163,61,0.85)' : 'rgba(95,203,187,0.55)');
        rect.setAttribute('stroke', 'rgba(234,227,211,0.25)');
        rect.setAttribute('stroke-width', '1');
        group.appendChild(rect);
      }
    });

    svg.appendChild(group);
    requestAnimationFrame(() => {
      group.style.transition = 'opacity 0.6s ease';
      group.setAttribute('opacity', '1');
    });

    if (caption) {
      caption.style.opacity = '0';
      setTimeout(() => {
        caption.textContent = `p(${n}) = ${all.length} — ${n} = ${parts.join(' + ')}`;
        caption.style.transition = 'opacity 0.4s ease';
        caption.style.opacity = '1';
      }, 250);
    }
  }

  render(sequence[0]);

  if (!prefersReducedMotion) {
    setInterval(() => {
      seqIndex = (seqIndex + 1) % sequence.length;
      render(sequence[seqIndex]);
    }, 2800);
  }
})();

// ══════════════════════════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════════════════════════
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-up');
  if (!els.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ══════════════════════════════════════════════════════════
//  NAV — active-section tracking
// ══════════════════════════════════════════════════════════
(function () {
  const links = document.querySelectorAll('.nav-links a[data-section]');
  if (!links.length) return;

  const sections = Array.from(links)
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

// ══════════════════════════════════════════════════════════
//  BACK TO TOP
// ══════════════════════════════════════════════════════════
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
