/* Sunstar Macedon — procedural Vergina-sun mosaic mark.
   Returns an inline <svg> string. Geometric/tessellated, animatable. */
(function () {
  const TAU = Math.PI * 2;

  // Palette (also mirrored in site.css)
  const C = {
    paper:    '#F4EFE2',
    grout:    '#F4EFE2',
    red:      '#BE3A2B',
    redDeep:  '#9E2E22',
    redLite:  '#CE5443',
    gold:     '#E2A93C',
    goldDeep: '#BE8526',
    goldLite: '#EFC25E',
    sage:     '#8F9D88',
    sageDeep: '#6E7D68',
  };

  function pt(cx, cy, r, a) {
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function f(n) { return Math.round(n * 100) / 100; }

  // Annular-sector tile (a "tessera") with rounded feel via straight edges
  function tile(cx, cy, r0, r1, a0, a1) {
    const [x0, y0] = pt(cx, cy, r0, a0);
    const [x1, y1] = pt(cx, cy, r1, a0);
    const [x2, y2] = pt(cx, cy, r1, a1);
    const [x3, y3] = pt(cx, cy, r0, a1);
    return `M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)} A${f(r1)} ${f(r1)} 0 0 1 ${f(x2)} ${f(y2)} L${f(x3)} ${f(y3)} A${f(r0)} ${f(r0)} 0 0 0 ${f(x0)} ${f(y0)} Z`;
  }

  function sunstarSVG(opts) {
    opts = opts || {};
    const size = opts.size || 480;
    const rays = opts.rays || 16;
    const detail = opts.detail !== false; // full mosaic field vs simplified
    const cls = opts.class || '';
    const id = opts.id || ('ss' + Math.random().toString(36).slice(2, 8));

    const VB = 200;
    const cx = 100, cy = 100;

    const rEdge   = 99;   // outer edge of green ring
    const rGreenI = 82;   // green ring inner
    const rRedO   = 78;   // red field outer
    const rRedI   = 26;   // red field inner (around hub)
    const rHub    = 23;   // rosette radius
    const gap     = 0.011; // angular grout gap (radians-ish fraction)

    let parts = [];

    // base paper disc (grout color shows between tiles)
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${rEdge}" fill="${C.grout}"/>`);

    // ---- GREEN OUTER RING (tesserae) ----
    const greenN = 44;
    let green = '';
    for (let i = 0; i < greenN; i++) {
      const a0 = (i / greenN) * TAU + gap;
      const a1 = ((i + 1) / greenN) * TAU - gap;
      const fill = i % 7 === 0 ? C.sageDeep : C.sage;
      green += `<path d="${tile(cx, cy, rGreenI + 0.6, rEdge - 0.6, a0, a1)}" fill="${fill}"/>`;
    }
    parts.push(`<g class="ss-ring">${green}</g>`);

    // ---- RED MOSAIC FIELD (radial brick) ----
    const ringDefs = detail
      ? [ [rRedI, 38], [rRedI + 13, 30], [rRedI + 26, 24], [rRedI + 39, 18], [rRedO - 3, 0] ]
      : [ [rRedI, 24], [rRedI + 17, 18], [rRedO - 5, 0] ];
    let red = '';
    for (let k = 0; k < ringDefs.length - 1; k++) {
      const r0 = ringDefs[k][0] + 0.5;
      const r1 = ringDefs[k + 1][0] - 0.5;
      const n = ringDefs[k][1];
      const off = (k % 2) * 0.5; // brick offset
      for (let i = 0; i < n; i++) {
        const a0 = ((i + off) / n) * TAU + gap;
        const a1 = ((i + 1 + off) / n) * TAU - gap;
        const fill = (i % 8 === 0) ? C.redDeep : (i % 11 === 0 ? C.redLite : C.red);
        red += `<path d="${tile(cx, cy, r0, r1, a0, a1)}" fill="${fill}"/>`;
      }
    }
    parts.push(`<g class="ss-field">${red}</g>`);

    // ---- GOLD RAYS (Vergina sun) ----
    let raysSvg = '';
    const rayTip = rRedO - 1;
    const rayBase = rHub + 1;
    const rayShoulder = rHub + (rayTip - rHub) * 0.34; // widest point a third out
    const halfW = (TAU / rays) * 0.62; // base half-width — bold spikes
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * TAU - Math.PI / 2;
      const [tx, ty] = pt(cx, cy, rayTip, a);
      const [slx, sly] = pt(cx, cy, rayShoulder, a - halfW);
      const [srx, sry] = pt(cx, cy, rayShoulder, a + halfW);
      const [bx, by] = pt(cx, cy, rayBase, a);
      const [mx, my] = pt(cx, cy, rayShoulder, a); // ridge line endpoint
      // kite spike, split down the middle into two facets for dimensionality
      raysSvg += `<path d="M${f(tx)} ${f(ty)} L${f(slx)} ${f(sly)} L${f(bx)} ${f(by)} L${f(mx)} ${f(my)} Z" fill="${C.gold}"/>`;
      raysSvg += `<path d="M${f(tx)} ${f(ty)} L${f(mx)} ${f(my)} L${f(bx)} ${f(by)} L${f(srx)} ${f(sry)} Z" fill="${C.goldDeep}"/>`;
    }
    parts.push(`<g class="ss-rays">${raysSvg}</g>`);

    // ---- CENTRAL ROSETTE / HUB ----
    let hub = '';
    hub += `<circle cx="${cx}" cy="${cy}" r="${rHub}" fill="${C.paper}" stroke="${C.goldDeep}" stroke-width="2.2"/>`;
    const spokes = 8;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * TAU;
      const [x1, y1] = pt(cx, cy, 6, a);
      const [x2, y2] = pt(cx, cy, rHub - 3, a);
      hub += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${C.goldDeep}" stroke-width="1.6"/>`;
    }
    hub += `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${C.gold}" stroke="${C.goldDeep}" stroke-width="1.4"/>`;
    parts.push(`<g class="ss-hub">${hub}</g>`);

    return `<svg class="sunstar ${cls}" viewBox="0 0 ${VB} ${VB}" width="${size}" height="${size}" role="img" aria-label="Sunstar Macedon emblem" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
  }

  window.sunstarSVG = sunstarSVG;
  window.SUNSTAR_COLORS = C;
  // Auto-hydrate any element with [data-sunstar]
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-sunstar]').forEach(function (el) {
      const size = parseInt(el.getAttribute('data-size') || '0', 10) || undefined;
      const rays = parseInt(el.getAttribute('data-rays') || '0', 10) || undefined;
      const detail = el.getAttribute('data-detail') !== 'false';
      el.innerHTML = sunstarSVG({ size: size, rays: rays, detail: detail, class: el.getAttribute('data-svgclass') || '' });
    });
  });
})();
