/**
 * Tabs Block — AEM Edge Delivery Services
 *
 * Model: xwalk (EDS + Universal Editor)
 * UE instrumentation: Applied (data-aue-*)
 *
 * DOM de entrada (matriz EDS):
 *   block
 *     └── div (fila N — 2 cols)
 *           ├── div (col 0) — <p>Label de la pestaña</p>
 *           └── div (col 1) — Rich text del panel
 *
 * @param {Element} block - Root element of the block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabsCounter = 0;

export default function decorate(block) {
  tabsCounter += 1;
  const blockId = `tabs-${tabsCounter}`;
  const rows = [...block.children];

  // Build tab list
  const tabList = document.createElement('div');
  tabList.classList.add('tabs__tab-list');
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Pestañas de contenido');

  // Build panels container
  const panelsContainer = document.createElement('div');
  panelsContainer.classList.add('tabs__panels');

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const labelCell = cols[0];
    const contentCell = cols[1];

    // Extract label text
    const labelText = labelCell ? labelCell.textContent.trim() : `Tab ${index + 1}`;

    // Create tab button
    const tab = document.createElement('button');
    tab.classList.add('tabs__tab');
    tab.id = `${blockId}-tab-${index}`;
    tab.setAttribute('type', 'button');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${blockId}-panel-${index}`);
    tab.textContent = labelText;

    if (index === 0) {
      tab.classList.add('tabs__tab--active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
    } else {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    }

    moveInstrumentation(labelCell, tab);
    tabList.append(tab);

    // Create panel
    const panel = document.createElement('section');
    panel.classList.add('tabs__panel');
    panel.id = `${blockId}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${blockId}-tab-${index}`);

    if (index === 0) {
      panel.classList.add('tabs__panel--active');
    } else {
      panel.setAttribute('hidden', '');
    }

    // Move content children into panel
    if (contentCell) {
      while (contentCell.firstChild) {
        panel.append(contentCell.firstChild);
      }
    }

    moveInstrumentation(contentCell, panel);

    // UE: panel is a component item
    panel.dataset.aueType = 'component';
    panel.dataset.aueModel = 'tabs-item';
    panel.dataset.aueLabel = 'Tab';

    panelsContainer.append(panel);
  });

  // Replace block contents
  block.replaceChildren(tabList, panelsContainer);

  // UE instrumentation on block root
  block.dataset.aueType = 'component';
  block.dataset.aueModel = 'tabs';
  block.dataset.aueLabel = 'Tabs';

  // UE instrumentation on tab list container
  tabList.dataset.aueType = 'container';
  tabList.dataset.aueFilter = 'tabs-filter';
  if (block.dataset.aueResource) {
    tabList.dataset.aueResource = block.dataset.aueResource;
  }

  // --- Interaction ---
  function activateTab(newTab) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = [...panelsContainer.querySelectorAll('[role="tabpanel"]')];

    tabs.forEach((t) => {
      t.classList.remove('tabs__tab--active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    panels.forEach((p) => {
      p.classList.remove('tabs__panel--active');
      p.setAttribute('hidden', '');
    });

    newTab.classList.add('tabs__tab--active');
    newTab.setAttribute('aria-selected', 'true');
    newTab.setAttribute('tabindex', '0');
    newTab.focus();

    const panelId = newTab.getAttribute('aria-controls');
    const panel = panelsContainer.querySelector(`#${panelId}`);
    if (panel) {
      panel.classList.add('tabs__panel--active');
      panel.removeAttribute('hidden');
    }
  }

  // Click delegation
  block.addEventListener('click', (e) => {
    const target = e.target.closest('[role="tab"]');
    if (target) activateTab(target);
  });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    const target = e.target.closest('[role="tab"]');
    if (!target) return;

    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(target);
    let newIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabs.length;
        e.preventDefault();
        activateTab(tabs[newIndex]);
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        activateTab(tabs[newIndex]);
        break;
      case 'Home':
        e.preventDefault();
        activateTab(tabs[0]);
        break;
      case 'End':
        e.preventDefault();
        activateTab(tabs[tabs.length - 1]);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activateTab(target);
        break;
      default:
        break;
    }
  });
}
