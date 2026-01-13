import { capitalCase } from 'change-case';
import { html, render } from 'uhtml';
import { get, set } from './localStorage.js';
import gemini from './gemini';
import { marked } from 'marked';
import { params } from 'tag-params';
import dialogGeminiKey from './dialogGeminiKey.js';

export default async ({ selected, variants, toggleMarkForLearning }) => {
  const container = document.querySelector('.dialogContainer');
  const total = variants.map(({ count }) => count).reduce((sum, value) => sum + value, 0);

  if (!get('geminiCache')) {
    set('geminiCache', {});
  }

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
        <div class="geminiContainer">
          Loading additional information...
        </div>
      </div>
      <footer>
        <a class="button full" onclick="${learningList}">${getLabel()}</a>
      </footer>
    </dialog>
  `);

  show();

  if (get('geminiApiKey')) {
    const geminiCache = get('geminiCache');
    if (!get('geminiCache')[selected.word]) {
      geminiCache[selected.word] = await gemini(selected.word);
      set('geminiCache', geminiCache);
    }

    render(container.querySelector('dialog .geminiContainer'), html`
      ${html(...params(marked.parse(geminiCache[selected.word])))}
    `);
  } else {
    render(container.querySelector('dialog .geminiContainer'), html`
      <a class="addKey" onclick="${dialogGeminiKey}">Add Gemini Key</a>
    `)
  }

  function getLabel() {
    const learning = get('learning');
    return learning.includes(selected.root)
      ? 'Remove from learning list'
      : 'Add to learning list';
  }

  function learningList() {
    toggleMarkForLearning({ root: selected.root });
    hide();
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