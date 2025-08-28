import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  Array.from(block.children).forEach((row) => {
    // Skip placeholder rows from Universal Editor (no meaningful content)
    if (
      !row.querySelector('img, picture, a, p, [data-aue-prop], [data-aue-resource]')
    ) {
      return;
    }

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Move row children to li
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Assign proper classes
    Array.from(li.children).forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
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
