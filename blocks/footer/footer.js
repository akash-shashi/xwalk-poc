import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Get footer path from metadata if available
  const footerMeta = getMetadata('footer');
  let footerPath;

  if (footerMeta) {
    footerPath = new URL(footerMeta, window.location).pathname;
  } else {
    footerPath = '/footer'; // Change if your fragment is at /en/footer
  }

  // Force absolute URL so it works in Universal Editor too
  const fragment = await loadFragment(`${window.location.origin}${footerPath}`);

  // Decorate footer DOM
  block.textContent = '';
  if (fragment) {
    const footer = document.createElement('div');
    while (fragment.firstElementChild) {
      footer.append(fragment.firstElementChild);
    }
    block.append(footer);
  }
}
