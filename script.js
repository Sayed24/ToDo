// DOM Elements
const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const themeSwitch = document.getElementById('theme-switch');
const searchInput = document.getElementById('search-task');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if(e.key==='Enter') addTask(); });

// Theme toggle
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

// Search filter
searchInput.addEventListener('input', filterTasks);

// Drag-and-drop using Sortable.js
new Sortable(taskList, {
  animation: 200,
  ghostClass: 'dragging',
  onEnd: updateLocalStorageOrder
});

// Functions
function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if(!text) return;

  const task = {
    id: Date.now(),
    text,
    priority,
    dueDate,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  dueDateInput.value = '';
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add(task.priority);
    if(task.completed) li.classList.add('completed');
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-main">
        <span class="task-text">${task.text}</span>
        <div>
          <button class="complete-btn">✔</button>
          <button class="delete-btn">✖</button>
        </div>
      </div>
      ${task.dueDate ? `<div class="task-meta">Due: ${task.dueDate}</div>` : ''}
    `;

    // Complete task
    li.querySelector('.complete-btn').addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorageOrder() {
  const liElements = document.querySelectorAll('#task-list li');
  const newTasks = [];
  liElements.forEach(li => {
    const task = tasks.find(t => t.id == li.dataset.id);
    if(task) newTasks.push(task);
  });
  tasks = newTasks;
  saveTasks();
}

function filterTasks() {
  const filter = searchInput.value.toLowerCase();
  const lis = document.querySelectorAll('#task-list li');
  lis.forEach(li => {
    const text = li.querySelector('.task-text').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
}

// Optional: reminder alert for due tasks
setInterval(() => {
  const now = new Date().toISOString().split('T')[0];
  tasks.forEach(task => {
    if(task.dueDate === now && !task.notified) {
      alert(`Reminder: "${task.text}" is due today!`);
      task.notified = true;
      saveTasks();
    }
  });
}, 60000); // checks every minute
