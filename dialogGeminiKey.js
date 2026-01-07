import { html, render } from 'uhtml';
import { set } from './localStorage';

export default () => {
  const container = document.querySelector('.dialogContainer');

  render(container, html``);
  render(container, html`
    <dialog>
      <header>
        <h1>Add Gemini Key</h1>
        <span class="material-symbols-outlined" onclick="${hide}">cancel</span>
      </header>
      <div class="content">
        <input type="text">
      </div>
      <footer>
        <a class="button" onclick="${save}">Save</a>
      </footer>
    </dialog>
  `);

  show();

  function save() {
    const value = container.querySelector('dialog input').value;
    set('geminiApiKey', value);
    hide();
  }

  function hide() {
    container.querySelector(`dialog`).close();
  }

  function show() {
    container.querySelector(`dialog`).showModal();
  }
};