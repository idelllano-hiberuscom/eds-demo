/**
 * Modal Block — AEM Edge Delivery Services
 *
 * Reusable modal/popup using native <dialog> element.
 * Triggered by external elements with data-modal-target="[modalId]".
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Pendiente (Fase 3 - UE & QA Specialist)
 *
 * DOM de entrada (matriz EDS):
 *   block (div.modal.contact)
 *     └── div (fila 0)
 *           ├── div (col 0) → <h2>¿Hablamos?</h2>
 *           └── div (col 1) → form content or richtext
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Lock page scroll when modal is open.
 */
function lockScroll() {
  document.documentElement.classList.add('scroll-locked');
}

/**
 * Unlock page scroll when modal is closed.
 */
function unlockScroll() {
  document.documentElement.classList.remove('scroll-locked');
}

/**
 * Set inert attribute on sibling elements to trap interaction.
 * @param {Element} block - The modal block element
 */
function setInertOnSiblings(block) {
  const section = block.closest('.section') || block.parentElement;
  [...section.parentElement.children].forEach((child) => {
    if (child !== section) child.setAttribute('inert', '');
  });
}

/**
 * Remove inert attribute from sibling elements.
 * @param {Element} block - The modal block element
 */
function removeInertFromSiblings(block) {
  const section = block.closest('.section') || block.parentElement;
  [...section.parentElement.children].forEach((child) => {
    if (child !== section) child.removeAttribute('inert');
  });
}

/**
 * Close the modal with exit animation.
 * @param {Element} block - The modal block element
 */
function closeModal(block) {
  const dialog = block.querySelector('.modal-dialog');
  if (!dialog || !dialog.open) return;

  block.classList.add('modal-is-closing');

  const finish = () => {
    dialog.close();
    block.classList.remove('modal-is-open', 'modal-is-closing');
    unlockScroll();
    removeInertFromSiblings(block);

    // Return focus to trigger
    const trigger = block.modalTrigger;
    if (trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
    block.modalTrigger = null;
  };

  const onTransitionEnd = () => {
    dialog.removeEventListener('transitionend', onTransitionEnd);
    finish();
  };

  dialog.addEventListener('transitionend', onTransitionEnd);
  // Fallback in case transitionend doesn't fire
  setTimeout(finish, 300);
}

/**
 * Open the modal.
 * @param {Element} block - The modal block element
 * @param {Element|null} trigger - The element that triggered the open
 */
function openModal(block, trigger) {
  const dialog = block.querySelector('.modal-dialog');
  if (!dialog || dialog.open) return;

  block.modalTrigger = trigger;
  dialog.showModal();
  block.classList.add('modal-is-open');
  lockScroll();
  setInertOnSiblings(block);
}

export default function decorate(block) {
  // Determine variant from authored class
  const variant = block.classList.contains('contact') ? 'contact' : 'default';
  const modalId = variant !== 'default' ? variant : `modal-${Date.now()}`;

  block.classList.add(`modal-${variant}`);
  block.dataset.modalId = modalId;

  // Extract content from EDS matrix
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  const titleCol = cols[0];
  const contentCol = cols[1];

  // Get the heading from col 0
  const heading = titleCol ? titleCol.querySelector('h1,h2,h3,h4,h5,h6') : null;

  // Build dialog structure
  const dialog = document.createElement('dialog');
  dialog.classList.add('modal-dialog');
  dialog.setAttribute('aria-modal', 'true');

  const titleId = `modal-${modalId}-title`;
  dialog.setAttribute('aria-labelledby', titleId);

  // Header
  const header = document.createElement('div');
  header.classList.add('modal-header');

  if (heading) {
    heading.id = titleId;
    heading.classList.add('modal-title');
    header.appendChild(heading);
  }

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close');
  closeBtn.type = 'button';
  closeBtn.dataset.modalClose = '';
  closeBtn.setAttribute('aria-label', 'Cerrar ventana de contacto');
  closeBtn.innerHTML = '<span class="icon icon-close" aria-hidden="true"></span>';
  header.appendChild(closeBtn);

  // Body
  const body = document.createElement('div');
  body.classList.add('modal-body');

  const content = document.createElement('div');
  content.classList.add('modal-content');

  // Move content col children into modal__content
  if (contentCol) {
    moveInstrumentation(contentCol, content);
    while (contentCol.firstChild) {
      content.appendChild(contentCol.firstChild);
    }
  }
  body.appendChild(content);

  // Footer
  const footer = document.createElement('div');
  footer.classList.add('modal-footer');
  footer.setAttribute('aria-live', 'polite');

  // Assemble dialog
  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);

  // Transfer instrumentation from original row to dialog
  moveInstrumentation(row, dialog);

  // Replace block children with dialog
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  block.appendChild(dialog);

  // === Event Listeners ===

  // Close button (delegation inside block)
  block.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) {
      closeModal(block);
    }
  });

  // Backdrop click: clicks on the dialog element itself (not inner content)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeModal(block);
  });

  // Native Escape key handling — control animation
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal(block);
  });

  // Document-level trigger listener (triggers live outside the block)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(`[data-modal-target="${modalId}"]`);
    if (trigger) {
      e.preventDefault();
      openModal(block, trigger);
    }
  });
}
