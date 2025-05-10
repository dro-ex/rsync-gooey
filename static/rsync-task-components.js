// static/rsync-task-components.js

// Once the DOM is ready, populate the #flags container with MDL checkboxes
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('flags');
  const flags = [
    { key: '-a',      label: 'Archive' },
    { key: '-r',      label: 'Recursive' },
    { key: '-t',      label: 'Preserve Times' },
    { key: '-z',      label: 'Compress' },
    { key: '-u',      label: 'Update' },
    { key: '-v',      label: 'Verbose' },
    { key: '--delete',   label: 'Delete' },
    { key: '--progress', label: 'Progress' },
    { key: '--stats',    label: 'Stats' },
    { key: '--dry-run',  label: 'Dry Run' }
  ];

  // Clear out any placeholder content
  container.innerHTML = '';

  // Create a Material checkbox for each flag
  flags.forEach(f => {
    const label = document.createElement('label');
    label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
    label.innerHTML = `
      <input type="checkbox"
             class="mdl-checkbox__input"
             name="flags"
             value="${f.key}">
      <span class="mdl-checkbox__label">${f.label}</span>
    `;
    container.appendChild(label);

    // Tell MDL to upgrade this new element into a styled component
    if (window.componentHandler) {
      componentHandler.upgradeElement(label);
    }
  });
});
