// static/rsync-task-components.js

window.addEventListener('DOMContentLoaded', () => {
  // Populate flags into the #flags container
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
      <input type="checkbox"
             class="mdl-checkbox__input"
             name="flags"
             value="${f.key}">
      <span class="mdl-checkbox__label">${f.label}</span>
    `;
    container.appendChild(label);
    componentHandler && componentHandler.upgradeElement(label);
  });

  // Load existing tasks into the table
  loadTasks();

  // Handle form submission via AJAX
  const form = document.getElementById('taskForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      src: form.src.value,
      dest: form.dest.value,
      flags: Array.from(container.querySelectorAll('input[name="flags"]:checked'))
        .map(cb => cb.value)
    };
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    form.reset();
    // Clear checkboxes
    container.querySelectorAll('input[name="flags"]').forEach(cb => cb.checked = false);
    loadTasks();
  });
});

// Fetch tasks and render rows
async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  const tbody = document.getElementById('tasks');
  tbody.innerHTML = '';
  tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mdl-data-table__cell--non-numeric">${task.name}</td>
      <td class="mdl-data-table__cell--non-numeric">${task.src}</td>
      <td class="mdl-data-table__cell--non-numeric">${task.dest}</td>
      <td>${(task.flags||[]).join(' ')}</td>
      <td>
        <button class="mdl-button mdl-js-button mdl-button--icon delete" data-id="${task.id}">
          <i class="material-icons">delete</i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
    componentHandler && componentHandler.upgradeElement(tr.querySelector('button'));
  });
  // Attach delete handlers
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this task?')) {
        await fetch(`/api/tasks/${btn.dataset.id}`, { method: 'DELETE' });
        loadTasks();
      }
    });
  });
}
