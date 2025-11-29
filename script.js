// DOM elements
const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const categorySelect = document.getElementById('category');
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

// Search
searchInput.addEventListener('input', filterTasks);

// Drag-and-drop Sortable.js
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
  const category = categorySelect.value;

  if(!text) return;

  const task = {
    id: Date.now(),
    text,
    priority,
    dueDate,
    category,
    completed: false,
    subtasks: []
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

    // Task HTML
    li.innerHTML = `
      <div class="task-main">
        <span class="task-text">${task.text}</span>
        <div>
          <button class="add-subtask">➕</button>
          <button class="complete-btn">✔</button>
          <button class="delete-btn">✖</button>
        </div>
      </div>
      <div class="task-meta">
        ${task.dueDate ? `<span>Due: ${task.dueDate}</span>` : ''}
        <span class="category ${task.category}">${task.category}</span>
      </div>
      <div class="progress-bar"><div class="progress-bar-inner"></div></div>
      <div class="subtasks"></div>
    `;

    const subtaskContainer = li.querySelector('.subtasks');
    task.subtasks.forEach((sub, index) => {
      const subEl = document.createElement('div');
      subEl.classList.add('subtask');
      if(sub.completed) subEl.classList.add('completed');
      subEl.dataset.index = index;
      subEl.innerHTML = `
        <span>${sub.text}</span>
        <div>
          <button class="sub-complete-btn">✔</button>
          <button class="sub-delete-btn">✖</button>
        </div>
      `;
      // Complete subtask
      subEl.querySelector('.sub-complete-btn').addEventListener('click', () => {
        sub.completed = !sub.completed;
        saveTasks();
        renderTasks();
      });
      // Delete subtask
      subEl.querySelector('.sub-delete-btn').addEventListener('click', () => {
        task.subtasks.splice(index,1);
        saveTasks();
        renderTasks();
      });
      subtaskContainer.appendChild(subEl);
    });

    // Add subtask
    li.querySelector('.add-subtask').addEventListener('click', () => {
      const subText = prompt('Enter subtask:');
      if(subText){
        task.subtasks.push({text: subText, completed: false});
        saveTasks();
        renderTasks();
      }
    });

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

    // Update progress bar
    const progressBar = li.querySelector('.progress-bar-inner');
    if(task.subtasks.length){
      const completed = task.subtasks.filter(s=>s.completed).length;
      const percent = Math.round((completed/task.subtasks.length)*100);
      progressBar.style.width = percent + '%';
    } else {
      progressBar.style.width = task.completed ? '100%' : '0%';
    }

    taskList.appendChild(li);
  });
}

function saveTasks(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorageOrder(){
  const lis = document.querySelectorAll('#task-list li');
  const newTasks = [];
  lis.forEach(li=>{
    const task = tasks.find(t=>t.id==li.dataset.id);
    if(task) newTasks.push(task);
  });
  tasks = newTasks;
  saveTasks();
}

function filterTasks(){
  const filter = searchInput.value.toLowerCase();
  const lis = document.querySelectorAll('#task-list li');
  lis.forEach(li=>{
    const text = li.querySelector('.task-text').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
}

// Reminder alerts for tasks due today
setInterval(()=>{
  const today = new Date().toISOString().split('T')[0];
  tasks.forEach(task=>{
    if(task.dueDate===today && !task.notified){
      alert(`Reminder: "${task.text}" is due today!`);
      task.notified = true;
      saveTasks();
    }
  });
}, 60000);
