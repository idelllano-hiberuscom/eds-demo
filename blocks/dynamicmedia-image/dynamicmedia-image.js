/**
 * @param {HTMLElement} $block
 */
export default function decorate(block) {
  console.log(block);
  // this shouldHide logic is temporary till the time DM rendering on published live site is resolved.
  const { hostname } = window.location;
  const shouldHide = hostname.includes('aem.live') || hostname.includes('aem.page');

  const deliveryType = Array.from(block.children)[0]?.textContent?.trim();
  const inputs = block.querySelectorAll('.dynamicmedia-image > div');

  const inputsArray = Array.from(inputs);
  if (inputsArray.length < 2) {
    console.log('Missing inputs, expecting 2, ensure both the image and DM URL are set in the dialog');
    return;
  }
  const imageEl = inputs[1]?.getElementsByTagName('img')[0];
  // Get DM Url input
  const dmUrlEl = inputs[2]?.getElementsByTagName('a')[0];
  const rotate = inputs[3]?.textContent?.trim();
  const flip = inputs[4]?.textContent?.trim();
  const altText = inputs[6].textContent?.trim();

  if (deliveryType != 'na' && shouldHide == false) {
    if (deliveryType === 'dm') {
      // Ensure S7 is loaded
      if (typeof s7responsiveImage !== 'function') {
        console.error('s7responsiveImage function is not defined, ensure script include is added to head tag');
        return;
      }

      // Get image

      if (!imageEl) {
        console.error('Image element not found, ensure it is defined in the dialog');
        return;
      }

      const imageSrc = imageEl.getAttribute('src');
      if (!imageSrc) {
        console.error('Image element source not found, ensure it is defined in the dialog');
        return;
      }

      // Get imageName from imageSrc expected in the format /content/dam/<...>/<imageName>.<extension>
      const imageName = imageSrc.split('/').pop().split('.')[0];

      const dmUrl = dmUrlEl?.getAttribute('href') || 'https://smartimaging.scene7.com/is/image/DynamicMediaNA';

      imageEl.setAttribute('data-src', dmUrl + (dmUrl.endsWith('/') ? '' : '/') + imageName);
      // imageEl.setAttribute("src", dmUrl + (dmUrl.endsWith('/') ? "" : "/") + imageName);
      imageEl.setAttribute('src', dmUrl + (dmUrl.endsWith('/') ? '' : '/') + imageName);
      imageEl.setAttribute('alt', altText || 'dynamic media image');
      imageEl.setAttribute('data-mode', 'smartcrop');
      block.innerHTML = '';
      block.appendChild(imageEl);
      s7responsiveImage(imageEl);

      // dmUrlEl.remove();
    }
    if (deliveryType === 'dm-openapi') {
      // block.children[1].querySelectorAll('picture > img')[0];

      block.children[6]?.remove();
      block.children[5]?.remove();
      block.children[4]?.remove();
      block.children[3]?.remove();
      block.children[2]?.remove();
      block.children[0]?.remove();
    }
  } else {
    block.innerHTML = '';
  }
}
