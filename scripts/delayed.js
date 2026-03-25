// add delayed functionality here
import {
  getMetadata, loadScript, fetchPlaceholders,
  sampleRUM,
} from './aem.js';
import {
  a, span, i,
} from './dom-helpers.js';
import {
  isInternalPage,
} from './utils.js';

// Adobe Target - start

window.targetGlobalSettings = {
  bodyHidingEnabled: false,
};

function loadAT() {
  function targetPageParams() {
    return {
      at_property: '549d426b-0bcc-be60-ce27-b9923bfcad4f',
    };
  }
  loadScript(`${window.hlx.codeBasePath}/scripts/at-lsig.js`);
}
// Adobe Target - end

// refactor tweetable links function
/**
 * Opens a popup for the Twitter links autoblock.
 */
function openPopUp(popUrl) {
  const popupParams = `height=450, width=550, top=${(window.innerHeight / 2 - 275)}`
   + `, left=${(window.innerWidth / 2 - 225)}`
   + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
  window.open(popUrl, 'fbShareWindow', popupParams);
}

/**
 * Finds and embeds custom JS and css
 */
function embedCustomLibraries() {
  const externalLibs = getMetadata('js-files');
  const libsArray = externalLibs?.split(',').map((url) => url.trim());

  libsArray.forEach((url, index) => {
    // console.log(`Loading script ${index + 1}: ${url}`);
    loadScript(`${url}`);
  });
}

/**
 * Finds and decorates anchor elements with Twitter hrefs
 */
function buildTwitterLinks() {
  const main = document.querySelector('main');
  if (!main) return;

  // get all paragraph elements
  const paras = main.querySelectorAll('p');
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);

  [...paras].forEach((paragraph) => {
    const tweetables = paragraph.innerHTML.match(/&lt;tweetable[^>]*&gt;([\s\S]*?)&lt;\/tweetable&gt;/g);
    if (tweetables) {
      tweetables.forEach((tweetableTag) => {
        const matchedContent = tweetableTag.match(
          /&lt;tweetable(?:[^>]*data-channel=['"]([^'"]*)['"])?(?:[^>]*data-hashtag=['"]([^'"]*)['"])?[^>]*&gt;([\s\S]*?)&lt;\/tweetable&gt;/,
        );
        const channel = matchedContent[1] || '';
        const hashtag = matchedContent[2] || '';
        const tweetContent = matchedContent[3];

        let modalURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`
          + `&original_referrer=${encodedUrl}&source=tweetbutton`;
        if (channel) modalURL += `&via=${encodeURIComponent(channel.charAt(0) === '@' ? channel.substring(1) : channel)}`;
        if (hashtag) modalURL += `&hashtags=${encodeURIComponent(hashtag)}`;

        const tweetableEl = span(
          { class: 'tweetable' },
          a({ href: modalURL, target: '_blank', tabindex: 0 }, tweetContent, i({ class: 'lp lp-twit' })),
        );
        paragraph.innerHTML = paragraph.innerHTML.replace(tweetableTag, tweetableEl.outerHTML);
      });
    }
    [...paragraph.querySelectorAll('.tweetable > a')].forEach((twitterAnchor) => {
      twitterAnchor.addEventListener('click', (event) => {
        event.preventDefault();
        const apiURL = twitterAnchor.href;
        openPopUp(apiURL);
      });
    });
  });
}

if (!window.location.hostname.includes('localhost')) {
  embedCustomLibraries();
  if (window.parent && !(window.parent.location.pathname.indexOf('/canvas/') > -1)) {
    loadAT();
  }
}

// === CECABANK COOKIE BANNER ===
const COOKIE_KEY = 'cecabank-cookie-consent';

function initCookieBanner() {
  if (localStorage.getItem(COOKIE_KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', 'Aviso de cookies');

  const msg = document.createElement('p');
  msg.className = 'cookie-banner-msg';
  msg.textContent = 'Utilizamos cookies propias y de terceros para mejorar tu experiencia y mostrar contenido personalizado.';

  const actions = document.createElement('div');
  actions.className = 'cookie-banner-actions';

  const acceptBtn = document.createElement('button');
  acceptBtn.type = 'button';
  acceptBtn.className = 'cookie-btn cookie-btn-accept';
  acceptBtn.textContent = 'Aceptar';

  const rejectBtn = document.createElement('button');
  rejectBtn.type = 'button';
  rejectBtn.className = 'cookie-btn cookie-btn-reject';
  rejectBtn.textContent = 'Rechazar';

  const configA = document.createElement('a');
  configA.href = '/privacidad';
  configA.className = 'cookie-btn cookie-btn-config';
  configA.textContent = 'Configuración';

  actions.appendChild(acceptBtn);
  actions.appendChild(rejectBtn);
  actions.appendChild(configA);
  banner.appendChild(msg);
  banner.appendChild(actions);
  document.body.appendChild(banner);

  function dismissBanner(choice) {
    localStorage.setItem(COOKIE_KEY, choice);
    banner.style.transform = 'translateY(20px)';
    banner.style.opacity = '0';
    banner.style.pointerEvents = 'none';
    setTimeout(() => banner.remove(), 400);
  }

  acceptBtn.addEventListener('click', () => dismissBanner('accepted'));
  rejectBtn.addEventListener('click', () => dismissBanner('rejected'));
}

initCookieBanner();
