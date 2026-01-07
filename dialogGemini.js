import { html, render } from 'uhtml';
import gemini from './gemini';
import { marked } from 'marked';
import { params } from 'tag-params';

export default async word => {
  const container = document.querySelector('.dialogContainer');

  render(container, html``);
  render(container, html`
    <dialog class="gemini">
      <header>
        <h1>Add Gemini Key</h1>
        <span class="material-symbols-outlined" onclick="${hide}">cancel</span>
      </header>
      <div class="content">
        Loading Gemini response...
      </div>
    </dialog>
  `);

  show();

  const markdown = await gemini(word);

  render(container.querySelector('dialog .content'), html`
    ${html(...params(marked.parse(markdown)))}
  `);

  function hide() {
    container.querySelector(`dialog`).close();
  }

  function show() {
    container.querySelector(`dialog`).showModal();
  }
};