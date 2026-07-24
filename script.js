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
})();
