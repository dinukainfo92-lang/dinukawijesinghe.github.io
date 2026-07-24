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

  /* ---------- hero terminal: simulated boot / ping sequence ---------- */
  const terminalBody = document.getElementById('terminalBody');

  if (terminalBody) {
    const prompt = 'noc@dinukawijesinghe.com:~$';

    // Each entry is either a typed command, or pre-rendered output lines.
    const script = [
      { type: 'cmd', text: 'whoami' },
      {
        type: 'output',
        lines: [
          '<span class="tl-key">Dinuka Hasanka Wijesinghe</span>',
          '<span class="tl-muted">Network Engineer — IP/MPLS Core · 7+ yrs</span>',
        ],
      },
      { type: 'cmd', text: 'ping dinukawijesinghe.com -c 4' },
      {
        type: 'output',
        lines: [
          'PING dinukawijesinghe.com: 56 data bytes',
          '64 bytes: icmp_seq=0 ttl=61 time=4.12 ms',
          '64 bytes: icmp_seq=1 ttl=61 time=3.87 ms',
          '64 bytes: icmp_seq=2 ttl=61 time=4.05 ms',
          '64 bytes: icmp_seq=3 ttl=61 time=3.94 ms',
          '<span class="tl-ok">4 packets transmitted, 4 received, 0% loss</span>',
        ],
      },
      { type: 'cmd', text: 'show version | include status' },
      {
        type: 'output',
        lines: [
          'role       : IP/MPLS Backbone Engineer',
          'based      : Sri Lanka',
          'uptime     : 7+ years',
          '<span class="tl-ok">status     : ● open to opportunities</span>',
        ],
      },
    ];

    let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderStatic = () => {
      const html = script
        .map((step) => {
          if (step.type === 'cmd') {
            return `<div class="tl-line"><span class="tl-prompt">${prompt}</span> <span class="tl-cmd">${step.text}</span></div>`;
          }
          return step.lines.map((l) => `<div class="tl-line">${l}</div>`).join('');
        })
        .join('');
      terminalBody.innerHTML = html;
    };

    if (reduceMotion) {
      renderStatic();
    } else {
      terminalBody.innerHTML = '';
      let stepIndex = 0;

      const typeCommand = (text, lineEl, done) => {
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';

        const promptSpan = document.createElement('span');
        promptSpan.className = 'tl-prompt';
        promptSpan.textContent = prompt + ' ';

        const cmdSpan = document.createElement('span');
        cmdSpan.className = 'tl-cmd';

        lineEl.appendChild(promptSpan);
        lineEl.appendChild(cmdSpan);
        lineEl.appendChild(cursor);

        const tick = () => {
          if (i <= text.length) {
            cmdSpan.textContent = text.slice(0, i);
            i += 1;
            setTimeout(tick, 32 + Math.random() * 28);
          } else {
            cursor.remove();
            done();
          }
        };
        tick();
      };

      const printOutput = (lines, done) => {
        let i = 0;
        const next = () => {
          if (i < lines.length) {
            const div = document.createElement('div');
            div.className = 'tl-line';
            div.innerHTML = lines[i];
            terminalBody.appendChild(div);
            i += 1;
            setTimeout(next, 90);
          } else {
            done();
          }
        };
        next();
      };

      const runStep = () => {
        if (stepIndex >= script.length) return;
        const step = script[stepIndex];
        stepIndex += 1;

        if (step.type === 'cmd') {
          const line = document.createElement('div');
          line.className = 'tl-line';
          terminalBody.appendChild(line);
          typeCommand(step.text, line, () => setTimeout(runStep, 260));
        } else {
          printOutput(step.lines, () => setTimeout(runStep, 420));
        }
      };

      // Kick off once the hero terminal scrolls into view (or immediately on load).
      runStep();
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

  toolTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      toolTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      toolPanels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(`tool-${tab.getAttribute('data-tool')}`);
      if (target) target.classList.add('active');
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
    lines.push(`${cmt('!')} ${cmt('generated by dinukawijesinghe.github.io — config generator')}`);
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

  /* ==========================================================
     TOOL 2 — Protocol comparison
     ========================================================== */
  const PROTOCOL_DATA = {
    OSPF: { type: 'IGP — link-state', scalability: 'Medium (area-based)', convergence: 'Fast', useCase: 'Enterprise & access networks', complexity: 'Medium' },
    'IS-IS': { type: 'IGP — link-state', scalability: 'High (carrier-grade)', convergence: 'Fast', useCase: 'ISP / carrier backbones', complexity: 'Medium' },
    'MP-BGP': { type: 'EGP / overlay control-plane', scalability: 'Very high (internet-scale)', convergence: 'Slower, policy-driven', useCase: 'VPNs, internet routing, EVPN control-plane', complexity: 'High' },
    EVPN: { type: 'L2VPN control-plane over MP-BGP', scalability: 'High', convergence: 'Fast (BGP-driven)', useCase: 'Data-centre & metro L2 extension', complexity: 'High' },
    VXLAN: { type: 'Data-plane overlay encapsulation', scalability: 'Very high (24-bit VNI)', convergence: 'N/A — data-plane only', useCase: 'DC fabric, multi-tenant overlay', complexity: 'Medium' },
    'RSVP-TE': { type: 'Traffic-engineering signalling', scalability: 'Medium (per-flow state)', convergence: 'Medium', useCase: 'Strict bandwidth-guaranteed TE tunnels', complexity: 'High' },
    'Segment Routing': { type: 'Traffic-engineering, source-routed', scalability: 'High (stateless core)', convergence: 'Fast', useCase: 'Simplified TE, no per-hop state', complexity: 'Medium' },
  };

  const compareControls = document.getElementById('compareControls');
  const compareTable = document.getElementById('compareTable');

  if (compareControls && compareTable) {
    let selected = ['OSPF', 'IS-IS', 'MP-BGP'];

    const rows = [
      { key: 'type', label: 'Type' },
      { key: 'scalability', label: 'Scalability' },
      { key: 'convergence', label: 'Convergence' },
      { key: 'useCase', label: 'Typical use case' },
      { key: 'complexity', label: 'Operational complexity' },
    ];

    const renderChips = () => {
      compareControls.innerHTML = Object.keys(PROTOCOL_DATA)
        .map(
          (name) =>
            `<button type="button" class="compare-chip${selected.includes(name) ? ' active' : ''}" data-proto="${name}">${name}</button>`
        )
        .join('');

      compareControls.querySelectorAll('.compare-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const name = chip.getAttribute('data-proto');
          if (selected.includes(name)) {
            if (selected.length > 1) selected = selected.filter((p) => p !== name);
          } else if (selected.length < 5) {
            selected.push(name);
          }
          renderChips();
          renderTable();
        });
      });
    };

    const renderTable = () => {
      const head = `<tr><th>Attribute</th>${selected.map((s) => `<th>${s}</th>`).join('')}</tr>`;
      const body = rows
        .map(
          (row) =>
            `<tr><td>${row.label}</td>${selected
              .map((s) => `<td>${PROTOCOL_DATA[s][row.key]}</td>`)
              .join('')}</tr>`
        )
        .join('');
      compareTable.innerHTML = head + body;
    };

    renderChips();
    renderTable();
  }
})();
