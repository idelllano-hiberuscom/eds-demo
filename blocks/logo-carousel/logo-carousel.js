import { createOptimizedPicture } from '../../scripts/aem.js';
import createSlider from '../../scripts/slider.js';

/**
 * Logo Carousel block
 *
 * Authored table structure:
 * | logo-carousel |
 * | logo-image-1  |
 * | logo-image-2  |
 * | logo-image-3  |
 */
export default async function decorate(block) {
  const rows = Array.from(block.children);

  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (!img) return;

    const li = document.createElement('li');
    const pic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '200' }]);
    li.appendChild(pic);
    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);

  // Only add slider controls if there are more logos than fit on screen
  const totalLogos = ul.children.length;
  if (totalLogos > 4) {
    await createSlider(block);
  }
}
