const taskInput = document.getElementById('new-task');
const addTaskButton = document.querySelector('.task-row-wrapper button');
const todoList = document.getElementById('incompleteTasks');
const completedList = document.getElementById('completed-tasks');

const createElement = function (tagName, properties) {
  return Object.assign(document.createElement(tagName), properties);
};

const createDeleteButton = function () {
  const deleteButton = createElement('button', { className: 'delete' });
  deleteButton.append(createElement('img', { src: './remove.svg' }));
  return deleteButton;
};

const createTaskItem = function (taskText) {
  const listItem = document.createElement('li');
  listItem.append(
    createElement('input', { type: 'checkbox' }),
    // innerText, not innerHTML: user input must be shown as text, not parsed as markup
    createElement('label', { className: 'task', innerText: taskText }),
    createElement('input', { type: 'text', className: 'task' }),
    createElement('button', { className: 'edit', innerText: 'Edit' }),
    createDeleteButton(),
  );
  return listItem;
};

const addTask = function () {
  if (!taskInput.value) return;
  const listItem = createTaskItem(taskInput.value);

  todoList.appendChild(listItem);
  bindTaskEvents(listItem, completeTask);

  taskInput.value = '';
};

const editTask = function () {
  const listItem = this.parentNode;

  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const editButton = listItem.querySelector('.edit');
  const isEditMode = listItem.classList.contains('editMode');
  if (isEditMode) {
    label.innerText = editInput.value;
    editButton.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
  }

  listItem.classList.toggle('editMode');
};

const deleteTask = function () {
  const listItem = this.parentNode;
  const taskList = listItem.parentNode;
  taskList.removeChild(listItem);
};

const moveTask = function (listItem, targetList, onCheckboxChange) {
  targetList.appendChild(listItem);
  bindTaskEvents(listItem, onCheckboxChange);
};

const completeTask = function () {
  moveTask(this.parentNode, completedList, uncompleteTask);
};

const uncompleteTask = function () {
  moveTask(this.parentNode, todoList, completeTask);
};

const bindTaskEvents = function (listItem, onCheckboxChange) {
  const checkBox = listItem.querySelector('input[type=checkbox]');
  const editButton = listItem.querySelector('button.edit');
  const deleteButton = listItem.querySelector('button.delete');

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = onCheckboxChange;
};

const bindListEvents = function (list, onCheckboxChange) {
  for (const listItem of list.children) {
    bindTaskEvents(listItem, onCheckboxChange);
  }
};

addTaskButton.addEventListener('click', addTask);
bindListEvents(todoList, completeTask);
bindListEvents(completedList, uncompleteTask);
