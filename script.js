// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Terminal boot / typing sequence
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const terminalBody = document.getElementById('terminalBody');

const terminalScript = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'text', text: 'dinuka-hasanka-wijesinghe' },
  { type: 'gap' },
  { type: 'prompt', text: '$ ping backbone -c 1' },
  { type: 'muted', text: '64 bytes from ip-mpls-core: icmp_seq=1 ttl=64 time=6.4ms' },
  { type: 'gap' },
  { type: 'prompt', text: '$ cat role.txt' },
  { type: 'text', text: 'Network Engineer — IP/MPLS Core, 7+ yrs ISP & carrier' },
  { type: 'gap' },
  { type: 'prompt', text: '$ echo $STATUS' },
  { type: 'muted', text: 'available_for_hire=true' },
];

function renderStatic(){
  terminalBody.innerHTML = terminalScript.map(line => {
    if (line.type === 'gap') return '';
    const cls = line.type === 'prompt' ? 'prompt' : line.type === 'muted' ? 'line-muted' : 'line-text';
    return `<div class="${cls}">${line.text}</div>`;
  }).join('');
}

async function typeSequence(){
  for (const line of terminalScript){
    if (line.type === 'gap'){
      terminalBody.appendChild(document.createElement('br'));
      continue;
    }
    const div = document.createElement('div');
    div.className = line.type === 'prompt' ? 'prompt' : line.type === 'muted' ? 'line-muted' : 'line-text';
    terminalBody.appendChild(div);
    for (const ch of line.text){
      div.textContent += ch;
      await new Promise(r => setTimeout(r, line.type === 'prompt' ? 28 : 14));
    }
    await new Promise(r => setTimeout(r, 120));
  }
}

if (reduceMotion){
  renderStatic();
} else {
  typeSequence();
}

// Reveal skill bars when scrolled into view
const bars = document.querySelectorAll('.iface-row[data-level]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const level = entry.target.getAttribute('data-level');
      const fill = entry.target.querySelector('.bar-fill');
      if (fill) fill.style.width = level + '%';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

bars.forEach(bar => observer.observe(bar));
