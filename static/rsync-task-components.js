class RsyncTaskList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.loadTasks();
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        table { width:100%; border-collapse: collapse; background: white; }
        th, td { padding: 0.5em; border: 1px solid #ccc; text-align: left; }
        th { background: #eee; }
        button { padding: 0.2em 0.5em; margin: 0 0.2em; font-size: 0.9em; }
      </style>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Source</th><th>Destination</th><th>Flags</th><th>Actions</th>
          </tr>
        </thead>
        <tbody id="tasks"></tbody>
      </table>
    `;
  }
  async loadTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    const tbody = this.shadowRoot.getElementById('tasks');
    tbody.innerHTML = '';
    tasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${task.name}</td>
        <td>${task.src}</td>
        <td>${task.dest}</td>
        <td>${(task.flags || []).join(' ')}</td>
        <td>
          <button class="edit" data-id="${task.id}">🖉</button>
          <button class="delete" data-id="${task.id}">🗑</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    this.shadowRoot.querySelectorAll('.delete').forEach(btn => {
      btn.onclick = async () => {
        if (confirm(`Delete task '${btn.closest('tr').children[0].innerText}'?`)) {
          await fetch(`/api/tasks/${btn.dataset.id}`, { method: 'DELETE' });
          this.loadTasks();
        }
      };
    });
    this.shadowRoot.querySelectorAll('.edit').forEach(btn => {
      btn.onclick = () => {
        const task = tasks.find(t => t.id == btn.dataset.id);
        document.querySelector('rsync-task-form').startEdit(task);
      };
    });
  }
}

class RsyncTaskForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.editing = null;
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.getElementById('taskForm')
      .addEventListener('submit', this.onSubmit.bind(this));
  }
  render() {
    const btnText = this.editing ? 'Update Task' : 'Add Task';
    this.shadowRoot.innerHTML = `
      <style>
        form { display: flex; flex-wrap: wrap; gap: 0.5em; margin-top: 1em; }
        input { flex: 1; padding: 0.5em; border: 1px solid #ccc; }
        #flags { flex-basis: 100%; }
        label { margin-right: 0.5em; }
        button { padding: 0.5em 1em; background: #0074D9; color: white; border: none; cursor: pointer; }
      </style>
      <form id="taskForm">
        <input name="name" placeholder="Task Name" required>
        <input name="src" placeholder="Source Path" required>
        <input name="dest" placeholder="Destination Path" required>
        <div id="flags">
          <label><input type="checkbox" name="flags" value="-a"> -a</label>
          <label><input type="checkbox" name="flags" value="-z"> -z</label>
          <label><input type="checkbox" name="flags" value="--delete"> --delete</label>
          <label><input type="checkbox" name="flags" value="-u"> -u</label>
          <label><input type="checkbox" name="flags" value="-v"> -v</label>
        </div>
        <button type="submit">${btnText}</button>
      </form>
    `;
    if (this.editing) {
      const form = this.shadowRoot.getElementById('taskForm');
      form.name.value = this.editing.name;
      form.src.value = this.editing.src;
      form.dest.value = this.editing.dest;
      this.shadowRoot.querySelectorAll('input[name="flags"]').forEach(cb => {
        cb.checked = this.editing.flags.includes(cb.value);
      });
    }
  }
  startEdit(task) {
    this.editing = task;
    this.render();
  }
  async onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      src: form.src.value,
      dest: form.dest.value,
      flags: Array.from(form.querySelectorAll('input[name="flags"]:checked'))
        .map(cb => cb.value)
    };
    if (this.editing) {
      await fetch(`/api/tasks/${this.editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      this.editing = null;
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    form.reset();
    this.render();
    document.querySelector('rsync-task-list').loadTasks();
  }
}

customElements.define('rsync-task-list', RsyncTaskList);
customElements.define('rsync-task-form', RsyncTaskForm);
