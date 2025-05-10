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
    const lbl = document.createElement('label');
    lbl.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
    lbl.innerHTML = `
      <input type="checkbox" class="mdl-checkbox__input" name="flags" value="${f.key}">
      <span class="mdl-checkbox__label">${f.label}</span>
    `;
    container.appendChild(lbl);
    componentHandler && componentHandler.upgradeElement(lbl);
  });

  // Load tasks
  loadTasks();

  // Form submit
  const form = document.getElementById('taskForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      src: form.src.value,
      dest: form.dest.value,
      flags: Array.from(container.querySelectorAll('input[name="flags"]:checked')).map(cb=>cb.value)
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/tasks/${editingId}` : '/api/tasks';
    await fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(data) });
    document.getElementById('taskDialog').close();
    form.reset();
    loadTasks();
  });
});

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
        <button class="mdl-button mdl-js-button mdl-button--icon edit" data-id="${task.id}"><i class="material-icons">edit</i></button>
        <button class="mdl-button mdl-js-button mdl-button--icon delete" data-id="${task.id}"><i class="material-icons">delete</i></button>
      </td>
    `;
    tbody.appendChild(tr);
    componentHandler && componentHandler.upgradeElement(tr.querySelectorAll('button'));
  });
  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      editingId = btn.dataset.id;
      const task = await (await fetch(`/api/tasks/${editingId}`)).json();
      const form = document.getElementById('taskForm');
      form.name.value = task.name;
      form.src.value = task.src;
      form.dest.value = task.dest;
      document.getElementById('flags').querySelectorAll('input').forEach(cb => cb.checked = task.flags.includes(cb.value));
      document.getElementById('taskDialog').showModal();
    });
  });
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this task?')) {
        await fetch(`/api/tasks/${btn.dataset.id}`, { method:'DELETE' });
        loadTasks();
      }
    });
  });
}
