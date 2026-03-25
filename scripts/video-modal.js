/**
 * Shared video modal utility
 * Exports: openVideoModal(videoUrl, triggerEl), closeVideoModal()
 */

let currentModal = null;
let triggerElement = null;

function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function isYouTube(url) {
  return /youtu\.be|youtube\.com/.test(url);
}

function buildYouTubeEmbed(url) {
  let videoId = '';
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1);
    } else {
      videoId = u.searchParams.get('v') || '';
    }
  } catch (_) {
    videoId = url.split('/').pop();
  }
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.setAttribute('title', 'Video player');
  return iframe;
}

function buildNativeVideo(url) {
  const videoEl = document.createElement('video');
  videoEl.src = url;
  videoEl.controls = true;
  videoEl.autoplay = true;
  videoEl.setAttribute('playsinline', '');
  return videoEl;
}

export function closeVideoModal() {
  if (!currentModal) return;
  currentModal.remove();
  currentModal = null;
  document.body.style.overflowY = '';
  if (triggerElement) {
    triggerElement.focus();
    triggerElement = null;
  }
}

export function openVideoModal(videoUrl, trigger = null) {
  if (currentModal) closeVideoModal();

  triggerElement = trigger;
  document.body.style.overflowY = 'hidden';

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'video-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', 'Video player');

  // Container
  const container = document.createElement('div');
  container.className = 'video-modal-container';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'video-modal-close';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeVideoModal);

  // Media
  const media = isYouTube(videoUrl) ? buildYouTubeEmbed(videoUrl) : buildNativeVideo(videoUrl);
  media.className = 'video-modal-media';

  container.appendChild(closeBtn);
  container.appendChild(media);
  backdrop.appendChild(container);
  document.body.appendChild(backdrop);

  currentModal = backdrop;

  // Close on backdrop click (not container)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeVideoModal();
  });

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  trapFocus(backdrop);
  closeBtn.focus();
}
