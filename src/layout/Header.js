export function renderHeader(active){
  const html=`
  <header class="header" role="banner">
    <a href="index.html" class="logo" aria-label="Mahak Naaz – Home">Mahak<span>.</span></a>
    <nav class="nav" aria-label="Main navigation">
      <a href="index.html" class="${active==='home'?'current':''}" ${active==='home'?'aria-current="page"':''}>Home</a>
      <a href="about.html" class="${active==='about'?'current':''}" ${active==='about'?'aria-current="page"':''}>About</a>
      <a href="projects.html" class="${active==='projects'?'current':''}" ${active==='projects'?'aria-current="page"':''}>Projects</a>
      <a href="contact.html" class="${active==='contact'?'current':''}" ${active==='contact'?'aria-current="page"':''}>Contact</a>
    </nav>
    <div class="header-actions">
      <button id="theme-toggle" class="icon-btn" type="button" aria-label="Toggle dark/light theme" title="Toggle theme">
        <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>
    </div>
  </header>`;
  document.body.insertAdjacentHTML('afterbegin', html);

  const root = document.documentElement;

  // Theme: default to light
  const saved = localStorage.getItem('theme') || 'light';
  root.dataset.theme = saved;

  const btn = document.getElementById('theme-toggle');
  if(btn){
    btn.addEventListener('click', () => {
      const nxt = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nxt;
      localStorage.setItem('theme', nxt);
    });
  }
}