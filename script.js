let tasks = [];
const TASKS_KEY = 'todo_tasks_v1';

const newTaskInput = document.getElementById('newTaskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const countEl = document.getElementById('count');

function loadTasks() {
  const raw = localStorage.getItem(TASKS_KEY);
  if (raw) {
    try {
      tasks = JSON.parse(raw);
    } catch (e) {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const task = { id: Date.now(), text: trimmed, completed: false };
  tasks.unshift(task);
  saveTasks();
  renderTasks();
}
function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const q = searchInput.value.trim().toLowerCase();
  tasksList.innerHTML = '';
  const filtered = tasks.filter(t => t.text.toLowerCase().includes(q));
  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task';

    const textEl = document.createElement('div');
    textEl.className = 'task-text';
    textEl.textContent = t.text;
    if (t.completed) textEl.classList.add('completed');

    const btns = document.createElement('div');
    btns.className = 'btns';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn complete';
    completeBtn.textContent = t.completed ? 'Batal' : 'Selesai';
    completeBtn.addEventListener('click', () => toggleComplete(t.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn delete';
    delBtn.textContent = 'Hapus';
    delBtn.addEventListener('click', () => {
      if (confirm('Hapus tugas ini?')) deleteTask(t.id);
    });

    btns.appendChild(completeBtn);
    btns.appendChild(delBtn);
    li.appendChild(textEl);
    li.appendChild(btns);
    tasksList.appendChild(li);
  });

  countEl.textContent = tasks.length;
}

addBtn.addEventListener('click', () => {
  addTask(newTaskInput.value);
  newTaskInput.value = '';
  newTaskInput.focus();
});

newTaskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addTask(newTaskInput.value);
    newTaskInput.value = '';
  }
});

searchInput.addEventListener('input', () => renderTasks());

loadTasks();
renderTasks();