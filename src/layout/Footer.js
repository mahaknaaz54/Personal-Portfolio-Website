export function renderFooter(){
  const html = `
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-top-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); padding-bottom: var(--space-4); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div class="footer-brand" style="text-align: left;">
          <a href="index.html" class="logo" style="color: #FFF8F5; font-size: 1.3rem;" aria-label="Mahak Naaz – Home">Mahak<span style="color: var(--c-sage);">.</span></a>
          <p style="font-size: var(--text-xs); color: var(--c-sage-pale); opacity: 0.8; margin-top: 2px;">
            BTech CSE (AI &amp; ML) • IILM University, Greater Noida
          </p>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation" style="display: flex; gap: var(--space-4);">
          <a href="index.html" style="font-size: var(--text-xs); font-weight: 500;">Home</a>
          <a href="about.html" style="font-size: var(--text-xs); font-weight: 500;">About</a>
          <a href="projects.html" style="font-size: var(--text-xs); font-weight: 500;">Projects</a>
          <a href="contact.html" style="font-size: var(--text-xs); font-weight: 500;">Contact</a>
        </nav>
      </div>

      <div class="footer-bottom-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2); padding-top: var(--space-4); font-size: var(--text-xs); color: var(--c-sage-pale); opacity: 0.75;">
        <p>&copy; ${new Date().getFullYear()} Mahak Naaz. All rights reserved.</p>
        <p>WCAG 2.1 AA &amp; SEO Compliant Portfolio</p>
      </div>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}