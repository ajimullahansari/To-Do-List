document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === '') return;

        const task = createTaskElement(taskText, priority);
        todoList.appendChild(task);

        // Save to local storage
        saveTasks();

        // Clear input
        taskInput.value = '';
    }

    function createTaskElement(taskText, priority) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task', `${priority}-priority`);

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✓';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => completeTask(taskDiv));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✗';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(taskDiv));

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);

        taskDiv.appendChild(taskTextSpan);
        taskDiv.appendChild(actionsDiv);

        return taskDiv;
    }

    function completeTask(taskElement) {
        taskElement.remove();
        completedList.appendChild(taskElement);
        saveTasks();
    }

    function deleteTask(taskElement) {
        taskElement.remove();
        saveTasks();
    }

    function saveTasks() {
        const todoTasks = Array.from(todoList.children).map(taskToObject);
        const completedTasks = Array.from(completedList.children).map(taskToObject);

        localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        const todoTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');

        todoTasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.priority);
            todoList.appendChild(taskElement);
        });

        completedTasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.priority);
            completedList.appendChild(taskElement);
        });
    }

    function taskToObject(taskElement) {
        return {
            text: taskElement.querySelector('span').textContent,
            priority: taskElement.classList.contains('low-priority') ? 'low' :
                      taskElement.classList.contains('medium-priority') ? 'medium' : 'high'
        };
    }
});
