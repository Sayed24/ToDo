const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e){
  if(e.key === 'Enter') addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');

  li.innerHTML = `
    <span>${taskText}</span>
    <div>
      <button class="complete-btn">✔</button>
      <button class="delete-btn">✖</button>
    </div>
  `;

  // Complete task
  li.querySelector('.complete-btn').addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  // Delete task
  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
  });

  taskList.appendChild(li);
  taskInput.value = '';
}
