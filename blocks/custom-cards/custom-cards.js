import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // change to ul, li
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Move row children to li
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Assign proper classes
    [...li.children].forEach((div) => {
      if (div.querySelector('picture') || div.querySelector('[data-aue-prop="image"]')) {
        div.className = 'cards-card-image';
      } else if (div.querySelector('a') || div.querySelector('[data-aue-prop="linkText"]')) {
        div.className = 'cards-card-link';
      } else {
        div.className = 'cards-card-body';
      }
    });  
    ul.append(li);
  });

  // Optimize pictures
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Replace block content
  block.textContent = '';
  block.append(ul);
}
