(() => {
  'use strict';

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- footer "last updated": pulled from the repo's latest commit ----------
     Keeps the static fallback text already in the HTML if the request fails
     (offline, rate-limited, etc.) so the footer never breaks. */
  const lastUpdatedEl = document.getElementById('lastUpdated');
  if (lastUpdatedEl) {
    fetch('https://api.github.com/repos/dinukainfo92-lang/dinukawijesinghe.github.io/commits?per_page=1')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((commits) => {
        const iso = commits && commits[0] && commits[0].commit && commits[0].commit.author && commits[0].commit.author.date;
        if (!iso) return;
        const date = new Date(iso);
        lastUpdatedEl.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      })
      .catch(() => { /* keep the static fallback already in the markup */ });
  }

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- section reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.section');
  const skillTable = document.querySelector('.iface-table');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- animate skill bars once visible ---------- */
  if (skillTable) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rows = entry.target.querySelectorAll('.iface-row[data-level]');
            rows.forEach((row, i) => {
              const fill = row.querySelector('.bar-fill');
              const level = row.getAttribute('data-level');
              if (fill && level) {
                setTimeout(() => {
                  fill.style.width = `${level}%`;
                }, i * 90);
              }
            });
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barObserver.observe(skillTable);
  }

  // World clock — Colombo / Sydney / Perth / London, computed client-side
  // from the visitor's own device clock via Intl, so it needs no API and
  // is always correct even across DST changes.
  const worldClockGrid = document.querySelector('.worldclock-grid');
  if (worldClockGrid) {
    const WORLD_CLOCK_HOME_TZ = 'Asia/Colombo';
    const WORLD_CLOCK_ZONES = ['Asia/Colombo', 'Asia/Dubai', 'Asia/Qatar', 'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland', 'Asia/Tokyo', 'Europe/London'];

    // Reads a timezone's current UTC offset (in minutes) via Intl's
    // "shortOffset" name (e.g. "GMT+5:30", "GMT+8", "GMT"), so DST is
    // always handled correctly without hardcoding any offsets.
    const getUtcOffsetMinutes = (tz, date) => {
      try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(date);
        const tzName = parts.find((p) => p.type === 'timeZoneName');
        if (!tzName) return null;
        if (tzName.value === 'GMT') return 0;
        const m = tzName.value.match(/GMT([+-])(\d+)(?::(\d+))?/);
        if (!m) return null;
        const sign = m[1] === '-' ? -1 : 1;
        const hours = parseInt(m[2], 10);
        const mins = m[3] ? parseInt(m[3], 10) : 0;
        return sign * (hours * 60 + mins);
      } catch (_) {
        return null;
      }
    };

    // Renders each city's own local date plus its time-difference (or
    // "Home base") on one line, e.g. "Sun, Aug 23 · +4:30 vs Colombo".
    const renderWorldClockDiffs = () => {
      const now = new Date();
      const homeOffset = getUtcOffsetMinutes(WORLD_CLOCK_HOME_TZ, now);
      WORLD_CLOCK_ZONES.forEach((tz) => {
        const item = worldClockGrid.querySelector(`.wc-item[data-tz="${tz}"]`);
        const diffEl = item && item.querySelector('.wc-diff');
        if (!diffEl) return;
        const dateStr = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }).format(now);

        let statusText;
        let isHome = false;
        if (tz === WORLD_CLOCK_HOME_TZ) {
          statusText = 'Home base';
          isHome = true;
        } else {
          const offset = getUtcOffsetMinutes(tz, now);
          if (offset === null || homeOffset === null) {
            diffEl.textContent = dateStr;
            diffEl.classList.remove('wc-diff-home');
            return;
          }
          const diff = offset - homeOffset;
          const sign = diff >= 0 ? '+' : '-';
          const abs = Math.abs(diff);
          const h = Math.floor(abs / 60);
          const mm = String(abs % 60).padStart(2, '0');
          statusText = `${sign}${h}:${mm} vs Colombo`;
        }
        diffEl.innerHTML = `${dateStr} <span class="wc-diff-dot">&middot;</span> ${statusText}`;
        diffEl.classList.toggle('wc-diff-home', isHome);
      });
    };

    const renderWorldClock = () => {
      const now = new Date();
      WORLD_CLOCK_ZONES.forEach((tz) => {
        const item = worldClockGrid.querySelector(`.wc-item[data-tz="${tz}"]`);
        if (!item) return;
        const parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).formatToParts(now);
        const hh = parts.find((p) => p.type === 'hour').value;
        const mm = parts.find((p) => p.type === 'minute').value;
        const ss = parts.find((p) => p.type === 'second').value;
        const timeEl = item.querySelector('.wc-time');
        const isDay = Number(hh) >= 6 && Number(hh) < 18;
        if (timeEl) {
          timeEl.textContent = `${hh}:${mm}:${ss}`;
          timeEl.classList.toggle('is-day', isDay);
          timeEl.classList.toggle('is-night', !isDay);
        }
        const iconEl = item.querySelector('.wc-icon');
        if (iconEl) {
          iconEl.classList.toggle('is-day', isDay);
          iconEl.classList.toggle('is-night', !isDay);
        }
      });
    };
    renderWorldClock();
    renderWorldClockDiffs();
    setInterval(renderWorldClock, 1000);
    // The date only changes once a day (at each city's own local midnight)
    // and the offset only changes at a DST transition (at most twice a
    // year), so there's no need to recompute every second — every 5
    // minutes keeps both correct with a negligible worst-case lag.
    setInterval(renderWorldClockDiffs, 5 * 60 * 1000);
  }

  /* ---------- subsea map: ctrl+scroll to zoom, double-click to reset ----------
     Zooms by shrinking/growing the SVG's own viewBox (a real vector zoom, so
     labels/lines stay crisp) around the pointer position. Only intercepts
     the wheel event when ctrlKey is set (also true for trackpad pinch), so
     normal page scrolling is completely unaffected everywhere else. */
  const subseaSvg = document.getElementById('subseaMapSvg');
  if (subseaSvg) {
    const parseViewBox = (str) => str.trim().split(/\s+/).map(Number);
    const home = parseViewBox(subseaSvg.dataset.homeViewbox);
    const [worldX, worldY, worldW, worldH] = parseViewBox(subseaSvg.dataset.minViewbox);
    const aspect = home[2] / home[3];
    const MIN_W = 120; // most zoomed-in, in viewBox units
    const MAX_W = worldW; // most zoomed-out: the full world map
    let vb = { x: home[0], y: home[1], w: home[2], h: home[3] };

    const applyViewBox = () => {
      subseaSvg.setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);
    };

    subseaSvg.addEventListener('wheel', (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      const rect = subseaSvg.getBoundingClientRect();
      // pointer position converted into current viewBox (SVG user-space) coordinates
      const px = vb.x + ((e.clientX - rect.left) / rect.width) * vb.w;
      const py = vb.y + ((e.clientY - rect.top) / rect.height) * vb.h;

      const zoomFactor = Math.exp(e.deltaY * 0.0018); // scroll up = zoom in, down = zoom out
      const newW = Math.min(MAX_W, Math.max(MIN_W, vb.w * zoomFactor));
      const newH = newW / aspect;
      const ratio = newW / vb.w;

      // keep the point under the cursor stationary while zooming
      vb.x = px - (px - vb.x) * ratio;
      vb.y = py - (py - vb.y) * ratio;
      vb.w = newW;
      vb.h = newH;

      // never pan past the edges of the actual world map
      vb.x = Math.max(worldX, Math.min(worldX + worldW - vb.w, vb.x));
      vb.y = Math.max(worldY, Math.min(worldY + worldH - vb.h, vb.y));

      applyViewBox();
    }, { passive: false });

    subseaSvg.addEventListener('dblclick', () => {
      vb = { x: home[0], y: home[1], w: home[2], h: home[3] };
      applyViewBox();
    });

    // ---- ctrl + right-click drag to pan ----
    // Right-click is repurposed for panning only while ctrl is held, so the
    // normal right-click context menu still works everywhere else (and even
    // over the map when ctrl isn't held).
    let isPanning = false;
    let panStart = null; // { mouseX, mouseY, vbX, vbY }

    subseaSvg.addEventListener('contextmenu', (e) => {
      if (e.ctrlKey) e.preventDefault();
    });

    subseaSvg.addEventListener('mousedown', (e) => {
      if (e.button !== 2 || !e.ctrlKey) return;
      e.preventDefault();
      isPanning = true;
      panStart = { mouseX: e.clientX, mouseY: e.clientY, vbX: vb.x, vbY: vb.y };
      subseaSvg.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning || !panStart) return;
      const rect = subseaSvg.getBoundingClientRect();
      const scaleX = vb.w / rect.width;
      const scaleY = vb.h / rect.height;
      const dx = (e.clientX - panStart.mouseX) * scaleX;
      const dy = (e.clientY - panStart.mouseY) * scaleY;

      let newX = panStart.vbX - dx;
      let newY = panStart.vbY - dy;
      newX = Math.max(worldX, Math.min(worldX + worldW - vb.w, newX));
      newY = Math.max(worldY, Math.min(worldY + worldH - vb.h, newY));
      vb.x = newX;
      vb.y = newY;
      applyViewBox();
    });

    window.addEventListener('mouseup', () => {
      if (!isPanning) return;
      isPanning = false;
      panStart = null;
      subseaSvg.style.cursor = 'grab';
      document.body.style.userSelect = '';
    });
  }

  /* ==========================================================
     GALLERY — placeholder fallback + lightbox
     Replace files under /assets/gallery/ with your own photos;
     tiles that fail to load automatically show a placeholder
     frame instead of a broken image icon.
     ========================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const placeholderIconSVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <circle cx="8.5" cy="10" r="1.6"></circle>
      <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 19"></path>
    </svg>`;

  galleryItems.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    img.addEventListener('error', () => {
      item.classList.add('is-placeholder');
      const caption = item.getAttribute('data-caption') || 'Add photo';
      const fallback = document.createElement('div');
      fallback.className = 'gallery-placeholder-icon';
      fallback.innerHTML = `${placeholderIconSVG}<span>${img.getAttribute('src')}</span>`;
      item.insertBefore(fallback, item.querySelector('figcaption'));
    });

    item.addEventListener('click', () => {
      if (item.classList.contains('is-placeholder')) return;
      lightboxImg.src = item.getAttribute('data-src') || img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ==========================================================
     TOOLS — tab switching
     ========================================================== */
  const toolTabs = document.querySelectorAll('.tool-tab');
  const toolPanels = document.querySelectorAll('.tool-panel');
  const toolFullPageLink = document.getElementById('toolFullPageLink');

  const TOOL_PAGE_URLS = {
    configgen: 'tools/config-generator.html',
    prepost:   'tools/prepost-check.html',
  };

  toolTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      toolTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      toolPanels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const toolKey = tab.getAttribute('data-tool');
      const target = document.getElementById(`tool-${toolKey}`);
      if (target) target.classList.add('active');
      if (toolFullPageLink && TOOL_PAGE_URLS[toolKey]) {
        toolFullPageLink.href = TOOL_PAGE_URLS[toolKey];
      }
    });
  });

  /* ==========================================================
     TOOL 1 — Router config generator
     ========================================================== */
  const cfgHostname = document.getElementById('cfgHostname');
  const cfgIface = document.getElementById('cfgIface');
  const cfgDesc = document.getElementById('cfgDesc');
  const cfgIp = document.getElementById('cfgIp');
  const cfgMask = document.getElementById('cfgMask');
  const cfgMpls = document.getElementById('cfgMpls');
  const cfgProtocol = document.getElementById('cfgProtocol');
  const cfgProtocolFields = document.getElementById('cfgProtocolFields');
  const configOutput = document.getElementById('configOutput');
  const copyConfigBtn = document.getElementById('copyConfigBtn');

  const protocolFieldSets = {
    ospf: [
      { id: 'cfgOspfProcess', label: 'process id', value: '10' },
      { id: 'cfgOspfArea', label: 'area', value: '0' },
    ],
    isis: [
      { id: 'cfgIsisInstance', label: 'instance name', value: 'CORE' },
      { id: 'cfgIsisLevel', label: 'level', value: 'level-2' },
    ],
    bgp: [
      { id: 'cfgBgpAs', label: 'local AS', value: '65000' },
      { id: 'cfgBgpNeighbor', label: 'neighbor ip', value: '10.10.10.2' },
      { id: 'cfgBgpRemoteAs', label: 'remote AS', value: '65001' },
    ],
  };

  const esc = (s) => (s || '').toString().replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  const renderProtocolFields = () => {
    const proto = cfgProtocol.value;
    const fields = protocolFieldSets[proto] || [];
    cfgProtocolFields.innerHTML = fields
      .map(
        (f) => `
        <div class="form-row">
          <label for="${f.id}">${f.label}</label>
          <input type="text" id="${f.id}" value="${f.value}" autocomplete="off">
        </div>`
      )
      .join('');
    fields.forEach((f) => {
      document.getElementById(f.id).addEventListener('input', generateConfig);
    });
  };

  function generateConfig() {
    const hostname = cfgHostname.value.trim() || 'ROUTER';
    const iface = cfgIface.value.trim() || 'GigabitEthernet0/0/0/1';
    const desc = cfgDesc.value.trim();
    const ip = cfgIp.value.trim() || '0.0.0.0';
    const mask = cfgMask.value.trim() || '255.255.255.0';
    const mpls = cfgMpls.checked;
    const proto = cfgProtocol.value;

    const kw = (s) => `<span class="cfg-kw">${esc(s)}</span>`;
    const val = (s) => `<span class="cfg-val">${esc(s)}</span>`;
    const cmt = (s) => `<span class="cfg-cmt">${esc(s)}</span>`;

    let lines = [];
    lines.push(`${cmt('!')} ${cmt('generated by dinukahasanka.com — config generator')}`);
    lines.push(`${kw('hostname')} ${val(hostname)}`);
    lines.push('!');
    lines.push(`${kw('interface')} ${val(iface)}`);
    if (desc) lines.push(` ${kw('description')} ${val(desc)}`);
    lines.push(` ${kw('ipv4 address')} ${val(ip)} ${val(mask)}`);
    if (mpls) lines.push(` ${kw('mpls ip')}`);
    lines.push(' no shutdown');
    lines.push('!');

    if (proto === 'ospf') {
      const pid = document.getElementById('cfgOspfProcess')?.value.trim() || '10';
      const area = document.getElementById('cfgOspfArea')?.value.trim() || '0';
      lines.push(`${kw('router ospf')} ${val(pid)}`);
      lines.push(` ${kw('area')} ${val(area)}`);
      lines.push(`  ${kw('interface')} ${val(iface)}`);
    } else if (proto === 'isis') {
      const inst = document.getElementById('cfgIsisInstance')?.value.trim() || 'CORE';
      const level = document.getElementById('cfgIsisLevel')?.value.trim() || 'level-2';
      lines.push(`${kw('router isis')} ${val(inst)}`);
      lines.push(` ${kw('is-type')} ${val(level)}`);
      lines.push(` ${kw('interface')} ${val(iface)}`);
      lines.push(`  ${kw('circuit-type')} ${val(level)}`);
      lines.push('  point-to-point');
    } else if (proto === 'bgp') {
      const as = document.getElementById('cfgBgpAs')?.value.trim() || '65000';
      const nbr = document.getElementById('cfgBgpNeighbor')?.value.trim() || '10.10.10.2';
      const rAs = document.getElementById('cfgBgpRemoteAs')?.value.trim() || '65001';
      lines.push(`${kw('router bgp')} ${val(as)}`);
      lines.push(` ${kw('neighbor')} ${val(nbr)}`);
      lines.push(`  ${kw('remote-as')} ${val(rAs)}`);
      lines.push('  address-family vpnv4 unicast');
    }
    lines.push('!');
    lines.push('end');

    configOutput.innerHTML = lines.join('\n');
  }

  if (cfgProtocol) {
    renderProtocolFields();
    generateConfig();

    [cfgHostname, cfgIface, cfgDesc, cfgIp, cfgMask, cfgMpls].forEach((el) => {
      el.addEventListener('input', generateConfig);
      el.addEventListener('change', generateConfig);
    });

    cfgProtocol.addEventListener('change', () => {
      renderProtocolFields();
      generateConfig();
    });
  }

  if (copyConfigBtn) {
    copyConfigBtn.addEventListener('click', async () => {
      const text = configOutput.textContent;
      try {
        await navigator.clipboard.writeText(text);
        copyConfigBtn.textContent = 'copied ✓';
        copyConfigBtn.classList.add('copied');
      } catch {
        copyConfigBtn.textContent = 'press ⌘/ctrl+C';
      }
      setTimeout(() => {
        copyConfigBtn.textContent = 'copy';
        copyConfigBtn.classList.remove('copied');
      }, 1600);
    });
  }

})();
