import { capitalCase } from 'change-case';
import { html, render } from 'uhtml';
import { get } from './localStorage.js';
import dialogGemini from './dialogGemini.js';

export default ({ selected, variants }) => {
  const container = document.querySelector('.dialogContainer');
  const total = variants.map(({ count }) => count).reduce((sum, value) => sum + value, 0);

  render(container, html``);
  render(container, html`
    <dialog>
      <header>
        <h1>${selected.word}</h1>
        <span class="material-symbols-outlined" onclick="${hide}">cancel</span>
      </header>
      <div class="content">
        <div class="variant">
          <p>All forms of the root word <strong>${capitalCase(selected.root)}</strong> in the text.</p>
          <span><strong>${total}</strong></span>
        </div>
        ${variants.map(renderVariant)}
      </div>
      ${renderFooter()}
    </dialog>
  `);

  show();

  function renderFooter() {
    if (get('geminiApiKey')) {
      return html`
        <footer>
          <a class="button full" onclick="${() => dialogGemini(selected.word)}">Explain this word (Gemini)</a>
        </footer>
      `;
    }
    return html``;
  }

  function renderVariant({ variant, count }) {
    return html`<div class="variant">${capitalCase(variant)}<span>${count}</span></div>`;
  }

  function hide() {
    container.querySelector(`dialog`).close();
  }

  function show() {
    container.querySelector(`dialog`).showModal();
  }
};