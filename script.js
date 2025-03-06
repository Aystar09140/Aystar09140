document.getElementById('addTaskButton').addEventListener('click', function() {
    addTask();
});

document.getElementById('colorButton').addEventListener('click', function() {
    document.body.style.backgroundColor = getRandomColor();
});


function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDescription = taskInput.value;
    if (taskDescription) {
        const taskList = document.getElementById('taskList');
        const li = document.createElement('li');
        li.textContent = taskDescription;
        taskList.appendChild(li);
        taskInput.value = '';
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
