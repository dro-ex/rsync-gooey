// static/rsync-task-components.js

let editingId = null;

window.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('flags');
  const addBtn      = document.getElementById('addTaskBtn');
  const dialog      = document.getElementById('taskDialog');
  const cancelBtn   = document.getElementById('cancelBtn');
  const saveBtn     = document.getElementById('saveBtn');
  const form        = document.getElementById('taskForm');
  const flagsConfig = [
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

  // --- Build the flags grid ---
  container.innerHTML = '';
  flagsConfig.forEach(f => {
    const lbl = document.createElement('label');
    lbl.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
    lbl.innerHTML = `
      <input type="checkbox"
             class="mdl-checkbox__input"
             name="flags"
             value="${f.key}">
      <span class="mdl-checkbox__label">${f.label}</span>
    `;
    container.appendChild(lbl);
    componentHandler && componentHandler.upgradeElement(lbl);
  });

  // --- Dialog controls ---
  addBtn.addEventListener('click', () => {
    editingId = null;
    form.reset();
    // uncheck all flags
    container.querySelectorAll('input').forEach(cb => cb.checked = false);
    dialog.showModal();
  });
  cancelBtn.addEventListener('click', () => dialog.close());
  saveBtn.addEventListener('click', () => form.requestSubmit());

  // --- Form submit handler (for both add & edit) ---
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      name : form.name.value,
      src  : form.src.value,
      dest : form.dest.value,
      flags: Array.from(container.querySelectorAll('input:checked')).map(cb => cb.value)
    };
    const url    = editingId ? `/api/tasks/${editingId}` : '/api/tasks';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    dialog.close();
    form.reset();
    loadTasks();
  });

  // --- Initial load of the table ---
  loadTasks();
});

async function loadTasks() {
  const res   = await fetch('/api/tasks');
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
        <button class="mdl-button mdl-js-button mdl-button--icon edit"   data-id="${task.id}">
          <i class="material-icons">edit</i>
        </button>
        <button class="mdl-button mdl-js-button mdl-button--icon delete" data-id="${task.id}">
          <i class="material-icons">delete</i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
    // Upgrade dynamically added buttons
    tr.querySelectorAll('button').forEach(b => componentHandler && componentHandler.upgradeElement(b));
  });

  // Wire up the new row’s edit/delete buttons
  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      editingId = btn.dataset.id;
      const task = await (await fetch(`/api/tasks/${editingId}`)).json();
      document.getElementById('taskForm').name.value = task.name;
      document.getElementById('taskForm').src.value  = task.src;
      document.getElementById('taskForm').dest.value = task.dest;
      // check flags
      document.getElementById('flags').querySelectorAll('input').forEach(cb => {
        cb.checked = task.flags.includes(cb.value);
      });
      document.getElementById('taskDialog').showModal();
    });
  });
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this task?')) {
        await fetch(`/api/tasks/${btn.dataset.id}`, { method: 'DELETE' });
        loadTasks();
      }
    });
  });
}
