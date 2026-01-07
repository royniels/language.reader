import { Stemmer, Tokenizer } from 'sastrawijs'
import { get, set } from './localStorage.js';
import { html, render } from 'uhtml';
import book from './testBook.js';
import clickEvents from './clickEvents.js';
import dialogDetails from './dialogDetails.js';
import gemini from './gemini.js';
import dialogGeminiKey from './dialogGeminiKey.js';

if (!Array.isArray(get('mastered'))) {
  set('mastered', []);
}
// if (!Array.isArray(get('learning'))) {
//   set('learning', []);
// }

// const response = await gemini('kenal');
// console.log(response);

const plainText = book();
const stemmer = new Stemmer();
const tokenizer = new Tokenizer();
const words = tokenizer.tokenize(plainText);
const wordsWithRoot = words
  .map((word, index) => {
    const root = stemmer.stem(word);
    return { word, root, index };
  })
  .filter(({ root }) => root.length > 1)

document.querySelector('main').innerHTML = book()
  .replace(/[ \t]+/g, ' ')
  .replace(/(\w+)/g, word => { // Each word wrapped in <a> 
    const match = wordsWithRoot.find(record => record.word === word.toLowerCase())
    if (match) {
      const { index, root } = match;
      // Tabindex disables Google popup at the bottom on mobile
      return `<a class="highlight" tabindex="-1" data-index="${index}" data-root="${root}">${word}</a>`;
    }
    return word;
  })
  .replace(/\n/g, '<br>');

clickEvents((instance, type) => {
  const index = parseInt(instance.getAttribute('data-index'));
  const root = instance.getAttribute('data-root');
  if (type === 'single') {
    toggleWordMastered({ index, root });
  } else if (type === 'double') {
    showDetails({ index, root });
  } else if (type === 'long') {
    // toggleMarkForLearning({ index, root });
  }
});

initializeHighlights();
updateProgress();
updateLegend();

function toggleWordMastered({ root }) {
  const mastered = get('mastered');
  const instances = document.querySelectorAll(`[data-root="${root}"]`);
  if (mastered.includes(root)) {
    instances.forEach(instance => instance.classList.remove('mastered'));
    set('mastered', mastered.filter(word => word !== root));
  } else {
    instances.forEach(instance => instance.classList.add('mastered'));
    set('mastered', [...mastered, root]);
  }
  updateProgress();
  updateLegend();
}

// function toggleMarkForLearning({ root }) {
//   const learning = get('learning');
//   const mastered = get('mastered');
//   const instances = document.querySelectorAll(`[data-root="${root}"]`);
//   // Unmark it as learned, will also mark it as mastered
//   if (learning.includes(root)) {
//     instances.forEach(instance => {
//       instance.classList.add('mastered');
//       instance.classList.remove('learning');
//     });
//     set('learning', learning.filter(word => word !== root));
//     set('mastered', [...new Set([...mastered, root])]);
//     // Mark it as learning, will also unmark it as mastered
//   } else {
//     instances.forEach(instance => {
//       instance.classList.remove('mastered');
//       instance.classList.add('learning');
//     });
//     set('learning', [...learning, root]);
//     set('mastered', mastered.filter(word => word !== root));
//   }
//   updateProgress();
//   updateLegend();
// }

function showDetails({ root, index }) {
  const selected = wordsWithRoot.find(record => record.index === index);
  const filtered = wordsWithRoot.filter(record => record.root === root);
  const variants = [...new Set(filtered.map(({ word }) => word))];
  const variantsWithCount = variants.map(variant => {
    const count = filtered.filter(({ word }) => word === variant).length;
    return { variant, count };
  });
  dialogDetails({ selected, variants: variantsWithCount });
}

function initializeHighlights() {
  const mastered = get('mastered');
  // const learning = get('learning');
  mastered.forEach(root => {
    // if (!learning.includes(root)) {
    document.querySelectorAll(`[data-root="${root}"]`)
      .forEach(instance => instance.classList.add('mastered'));
    // }
  });
  // learning.forEach(root => {
  //   document.querySelectorAll(`[data-root="${root}"]`)
  //     .forEach(instance => instance.classList.add('learning'));
  // });
}

function updateProgress() {
  const total = wordsWithRoot.length;
  const mastered = [...document.querySelectorAll('.highlight.mastered')].length;
  const percentage = (mastered / total) * 100
  const styles = `width: ${Math.round(percentage)}%;`;
  render(document.querySelector('.progress'), html`
    <div class="bar" style="${styles}"></div>
  `);
}

function updateLegend() {
  const total = wordsWithRoot.length;
  const mastered = [...document.querySelectorAll('.highlight.mastered')].length;
  // const learning = [...document.querySelectorAll('.highlight.learning')]
  // .map(instance => instance.getAttribute('data-root'));

  render(document.querySelector('.legend'), html`
    <div class="mastered">
      <span></span> Words mastered (${mastered.toLocaleString()}/${total.toLocaleString()})
    </div>
    <a onclick="${dialogGeminiKey}">Add Gemini Key</a>
  `);

  // render(document.querySelector('.legend'), html`
  //   <div class="mastered">
  //     <span></span> Words mastered (${mastered.toLocaleString()}/${total.toLocaleString()})
  //   </div>
  //   <div class="markedForLearning">
  //     <span></span> Marked for learning (${[...new Set(learning)].length})
  //   </div>
  // `);
}
