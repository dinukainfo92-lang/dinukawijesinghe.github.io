/* ===== Tokens ===== */
:root{
  --bg: #0B1220;
  --surface: #121A2B;
  --surface-2: #17213A;
  --border: #24314D;
  --text: #E7ECF5;
  --text-muted: #8B98B3;
  --accent-amber: #FFB454;
  --accent-cyan: #56E1C7;
  --accent-red: #FF6B6B;

  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;

  --maxw: 1080px;
}

*{ box-sizing: border-box; }
html{ scroll-behavior: smooth; }

body{
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.wrap{
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 24px;
}

a{ color: inherit; text-decoration: none; }

::selection{ background: var(--accent-amber); color: #0B1220; }

:focus-visible{
  outline: 2px solid var(--accent-cyan);
  outline-offset: 3px;
}

/* subtle scanline texture over everything, very low opacity */
.scanline{
  position: fixed; inset: 0; pointer-events: none; z-index: 40;
  background: repeating-linear-gradient(
    to bottom, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px,
    transparent 1px, transparent 3px
  );
  mix-blend-mode: overlay;
}

/* ===== Header ===== */
.site-header{
  position: sticky; top: 0; z-index: 30;
  background: rgba(11,18,32,0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.header-inner{
  display: flex; align-items: center; justify-content: space-between;
  height: 64px;
}
.logo{
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.02em;
}
.logo-prompt{ color: var(--accent-cyan); }
.cursor-blink{
  color: var(--accent-amber);
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink{ 50%{ opacity: 0; } }

.nav{ display: flex; gap: 28px; }
.nav a{
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  position: relative;
  transition: color 0.2s ease;
}
.nav a::before{ content: "./"; color: var(--accent-cyan); opacity: 0; transition: opacity 0.2s ease; }
.nav a:hover{ color: var(--text); }
.nav a:hover::before{ opacity: 1; }

.nav-toggle{
  display: none;
  flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 8px;
}
.nav-toggle span{ width: 22px; height: 2px; background: var(--text); display: block; }

/* ===== Hero ===== */
.hero{ padding: 96px 24px 64px; }
.hero-grid{
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
}
.eyebrow{
  font-family: var(--font-mono);
  color: var(--accent-cyan);
  font-size: 0.85rem;
  margin: 0 0 14px;
  letter-spacing: 0.03em;
}
.hero-text h1{
  font-family: var(--font-mono);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.08;
  margin: 0 0 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hero-sub{
  color: var(--text-muted);
  font-size: 1.05rem;
  max-width: 46ch;
  margin: 0 0 32px;
}
.hero-actions{ display: flex; gap: 14px; flex-wrap: wrap; }

.btn{
  font-family: var(--font-mono);
  font-size: 0.88rem;
  padding: 12px 22px;
  border-radius: 4px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  display: inline-block;
}
.btn-primary{
  background: var(--accent-amber);
  color: #16110A;
  border-color: var(--accent-amber);
  font-weight: 600;
}
.btn-primary:hover{ background: #ffc477; }
.btn-ghost{ color: var(--text); }
.btn-ghost:hover{ border-color: var(--accent-cyan); color: var(--accent-cyan); }

/* Terminal card */
.terminal{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 60px -20px rgba(0,0,0,0.6);
}
.terminal-bar{
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.dot{ width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-red{ background: var(--accent-red); }
.dot-amber{ background: var(--accent-amber); }
.dot-green{ background: var(--accent-cyan); }
.terminal-title{
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-left: 8px;
}
.terminal-body{
  font-family: var(--font-mono);
  font-size: 0.86rem;
  padding: 20px;
  min-height: 230px;
  color: var(--accent-cyan);
  white-space: pre-wrap;
}
.terminal-body .line-text{ color: var(--text); }
.terminal-body .line-muted{ color: var(--text-muted); }
.terminal-body .prompt{ color: var(--accent-amber); }

/* ===== Sections ===== */
.section{ padding: 72px 24px; border-top: 1px solid var(--border); }
.section-tag{
  font-family: var(--font-mono);
  color: var(--accent-amber);
  font-size: 0.8rem;
  margin: 0 0 10px;
}
.section-title{
  font-family: var(--font-mono);
  font-size: 1.6rem;
  margin: 0 0 32px;
}

/* About */
.about-grid{
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 48px;
  align-items: start;
}
.about-text{ font-size: 1.05rem; color: var(--text-muted); max-width: 60ch; }
.about-meta{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.about-meta li{
  font-family: var(--font-mono); font-size: 0.9rem;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}
.about-meta li span:first-child{
  color: var(--text-muted); width: 70px; flex-shrink: 0; text-transform: uppercase; font-size: 0.72rem;
}

/* LEDs */
.led{ width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.led-up{ background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); animation: pulse 2s ease-in-out infinite; }
.led-amber{ background: var(--accent-amber); box-shadow: 0 0 8px var(--accent-amber); }
@keyframes pulse{ 0%,100%{ opacity: 1; } 50%{ opacity: 0.45; } }

/* Skills table */
.iface-table{ border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.iface-row{
  display: grid;
  grid-template-columns: 90px 1fr 110px 140px;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}
.iface-row:last-child{ border-bottom: none; }
.iface-head{
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  background: var(--surface);
}
.iface-name{ font-family: var(--font-mono); color: var(--accent-amber); }
.iface-status{ display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.82rem; }
.iface-status.up{ color: var(--accent-cyan); }
.iface-status.admin{ color: var(--accent-amber); }

.bar{ height: 6px; background: var(--surface-2); border-radius: 3px; overflow: hidden; display: block; }
.bar-fill{
  display: block; height: 100%; width: 0%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-amber));
  transition: width 1.1s ease;
}

/* Timeline */
.timeline{ list-style: none; margin: 0; padding: 0; border-left: 2px solid var(--border); }
.timeline-item{
  position: relative;
  padding: 4px 0 36px 32px;
}
.timeline-item::before{
  content: "";
  position: absolute; left: -7px; top: 6px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--accent-amber);
  box-shadow: 0 0 0 4px var(--bg);
}
.timeline-date{ font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 6px; }
.timeline-body h3{ margin: 0 0 4px; font-size: 1.15rem; }
.timeline-org{ color: var(--text-muted); font-size: 0.9rem; margin: 0 0 8px; font-family: var(--font-mono); }
.timeline-body p:last-child{ color: var(--text-muted); margin: 0; max-width: 62ch; }
.timeline-body ul{ margin: 0; padding-left: 18px; color: var(--text-muted); max-width: 64ch; }
.timeline-body ul li{ margin-bottom: 8px; font-size: 0.94rem; }
.timeline-body ul li::marker{ color: var(--accent-amber); }

/* Cards */
.card-grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.card{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.card:hover{ border-color: var(--accent-cyan); transform: translateY(-2px); }
.card-tag{
  font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;
  color: var(--accent-amber); margin: 0 0 10px; letter-spacing: 0.04em;
}
.card h3{ margin: 0 0 10px; font-size: 1.05rem; }
.card p:last-child{ color: var(--text-muted); margin: 0; font-size: 0.92rem; }

/* Contact */
.contact-sub{ color: var(--text-muted); max-width: 56ch; margin: 0 0 40px; }
.contact-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.contact-card{
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  background: var(--surface);
  display: flex; flex-direction: column; gap: 6px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.contact-card:hover{ border-color: var(--accent-amber); transform: translateY(-2px); }
.contact-label{ font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--accent-cyan); }
.contact-value{ font-family: var(--font-mono); font-size: 0.95rem; }

/* Footer */
.site-footer{ border-top: 1px solid var(--border); padding: 28px 24px; }
.footer-inner{
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
}
.footer-inner p{ margin: 0; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }
.footer-ping{ display: flex; align-items: center; gap: 8px; }

/* ===== Responsive ===== */
@media (max-width: 860px){
  .hero-grid{ grid-template-columns: 1fr; }
  .about-grid{ grid-template-columns: 1fr; }
  .card-grid{ grid-template-columns: 1fr; }
  .contact-grid{ grid-template-columns: 1fr; }
  .iface-row{ grid-template-columns: 70px 1fr 90px; }
  .iface-row .bar{ display: none; }
  .iface-head span:last-child{ display: none; }
}

@media (max-width: 680px){
  .nav{
    position: absolute; top: 64px; left: 0; right: 0;
    background: var(--bg); border-bottom: 1px solid var(--border);
    flex-direction: column; padding: 16px 24px; gap: 18px;
    display: none;
  }
  .nav.open{ display: flex; }
  .nav-toggle{ display: flex; }
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
  html{ scroll-behavior: auto; }
}
