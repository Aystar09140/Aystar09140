document.getElementById('addTaskButton').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDescription = taskInput.value.trim();
    
    if (taskDescription === '') {
        alert('Please enter a task description.');
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskDescription}</span>
        <div>
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
            <button class="done" onclick="markTaskDone(this)">Done</button>
        </div>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
}

function deleteTask(button) {
    const taskList = document.getElementById('taskList');
    taskList.removeChild(button.parentElement.parentElement);
}

function editTask(button) {
    const taskSpan = button.parentElement.parentElement.querySelector('span');
    const taskText = taskSpan.textContent.replace('✓ ', ''); // Remove checkmark for editing
    const newDescription = prompt('Edit task:', taskText);
    
    if (newDescription !== null) {
        taskSpan.textContent = newDescription.trim();
    }
}

function markTaskDone(button) {
    const taskItem = button.parentElement.parentElement;
    const taskSpan = taskItem.querySelector('span');
    
    // Toggle done class
    taskItem.classList.toggle('done');

    // Add or remove the checkmark based on the state
    if (taskItem.classList.contains('done')) {
        taskSpan.innerHTML = `&#10003; ${taskSpan.textContent}`; // Add checkmark
    } else {
        taskSpan.innerHTML = taskSpan.innerHTML.replace(/&#10003; /, ''); // Remove checkmark
    }
}