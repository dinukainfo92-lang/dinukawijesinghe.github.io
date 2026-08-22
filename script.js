(() => {
  'use strict';

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ---------- hero: live network topology diagram ---------- */
  const topoStage = document.getElementById('topoStage');
  const topoPps = document.getElementById('topoPps');

  if (topoStage) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Small "packets/sec" counter that drifts around a realistic-looking
    // baseline, purely cosmetic — gives the diagram a sense of live traffic
    // without pretending to be real telemetry.
    if (topoPps) {
      if (reduceMotion) {
        topoPps.textContent = '1.1k';
      } else {
        let value = 1100;
        const tick = () => {
          value += Math.round((Math.random() - 0.5) * 180);
          value = Math.max(820, Math.min(1450, value));
          topoPps.textContent = (value / 1000).toFixed(1) + 'k';
          setTimeout(tick, 900 + Math.random() * 500);
        };
        setTimeout(tick, 500);
      }
    }
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
