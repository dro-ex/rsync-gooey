// Populate the flags checkboxes into the #flags container on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('flags');
  const flags = [
    { key: '-a', label: 'Archive' },
    { key: '-r', label: 'Recursive' },
    { key: '-t', label: 'Preserve Times' },
    { key: '-z', label: 'Compress' },
    { key: '-u', label: 'Update' },
    { key: '-v', label: 'Verbose' },
    { key: '--delete', label: 'Delete' },
    { key: '--progress', label: 'Progress' },
    { key: '--stats', label: 'Stats' },
    { key: '--dry-run', label: 'Dry Run' }
  ];
  container.innerHTML = '';
  flags.forEach(f => {
    const label = document.createElement('label');
    label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
    label.innerHTML = `
      <input type="checkbox" class="mdl-checkbox__input" name="flags" value="${f.key}">
      <span class="mdl-checkbox__label">${f.label}</span>
    `;
    container.appendChild(label);
    // upgrade to MDL component
    if (window.componentHandler) {
      componentHandler.upgradeElement(label);
    }
  });
});
