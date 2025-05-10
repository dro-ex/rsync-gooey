console.log('rsync-task-components loaded');

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
    this.shadowRoot.innerHTML = ``; // table rendering moved to index.html
  }
  async loadTasks() {
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
          <button class="mdl-button mdl-js-button mdl-button--icon edit" data-id="${task.id}">
            <i class="material-icons">edit</i>
          </button>
          <button class="mdl-button mdl-js-button mdl-button--icon delete" data-id="${task.id}">
            <i class="material-icons">delete</i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete').forEach(btn => {
      btn.onclick = async () => {
        if (confirm('Delete this task?')) {
          await fetch(`/api/tasks/${btn.dataset.id}`, { method:'DELETE' });
          this.loadTasks();
        }
      };
    });
    document.querySelectorAll('.edit').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        fetch(`/api/tasks/${id}`).then(r=>r.json()).then(task=>{
          document.querySelector('rsync-task-form').startEdit(task);
        });
      };
    });
  }
}

class RsyncTaskForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this.editing = null;
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.getElementById('taskForm')
      .addEventListener('submit', this.onSubmit.bind(this));
    this.renderFlags();
  }
  render() {
    // moved to index.html
  }
  renderFlags() {
    const container = document.getElementById('flags');
    const flags = [
      {key:'-a',label:'Archive'},
      {key:'-r',label:'Recursive'},
      {key:'-t',label:'Preserve Times'},
      {key:'-z',label:'Compress'},
      {key:'-u',label:'Update'},
      {key:'-v',label:'Verbose'},
      {key:'--delete',label:'Delete'},
      {key:'--progress',label:'Progress'},
      {key:'--stats',label:'Stats'},
      {key:'--dry-run',label:'Dry Run'}
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
      componentHandler.upgradeElement(lbl);
    });
  }
  startEdit(task) {
    this.editing = task;
    document.querySelector('input[name=name]').value = task.name;
    document.querySelector('input[name=src]').value = task.src;
    document.querySelector('input[name=dest]').value = task.dest;
    Array.from(document.querySelectorAll('input[name=flags]')).forEach(cb => {
      cb.checked = task.flags.includes(cb.value);
    });
  }
  async onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      src: form.src.value,
      dest: form.dest.value,
      flags: Array.from(form.querySelectorAll('input[name=flags]:checked')).map(cb=>cb.value)
    };
    const method = this.editing ? 'PUT' : 'POST';
    const url = this.editing ? `/api/tasks/${this.editing.id}` : '/api/tasks';
    await fetch(url, {method,headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    form.reset(); this.editing=null;
    document.querySelector('rsync-task-list').loadTasks();
  }
}

customElements.define('rsync-task-list',RsyncTaskList);
customElements.define('rsync-task-form',RsyncTaskForm);
