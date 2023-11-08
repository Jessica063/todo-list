document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add");
    const taskList = document.getElementById("task-list");
    const filterDropdown = document.getElementById("filter");
    const clearAllButton = document.getElementById("clear-all");

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const taskItem = createTaskElement(taskText);
            taskList.appendChild(taskItem);
            taskInput.value = "";

            // Save tasks to local storage
            saveTasks();
        }
    }

    // Create a new task element with the checkbox first and the edit and delete icons
    function createTaskElement(text) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <input type="checkbox" class="complete">
            <span>${text}</span>
            <span class="date">${formatDate(new Date())}</span>
            <i class='bx bx-edit edit' title="Edit"></i>
            <i class='bx bx-trash delete' title="Delete"></i>
        `;
        taskItem.querySelector(".complete").addEventListener("change", markComplete);
        taskItem.querySelector(".edit").addEventListener("click", editTask);
        taskItem.querySelector(".delete").addEventListener("click", deleteTask);
        return taskItem;
    }

    // Function to mark a task as complete
    function markComplete() {
        const li = this.parentNode;
        li.classList.toggle("completed");
        saveTasks();
    }

    // Function to edit a task
    function editTask() {
        const li = this.parentNode;
        const taskText = li.querySelector("span").textContent;
        const newTaskText = prompt("Edit task:", taskText);
        if (newTaskText !== null) {
            li.querySelector("span").textContent = newTaskText;
            saveTasks();
        }
    }

    // Function to delete a task
    function deleteTask() {
        const li = this.parentNode;
        taskList.removeChild(li);
        saveTasks();
    }

    function filterTasks() {
        const filter = filterDropdown.value;
        taskList.querySelectorAll("li").forEach(task => {
            if (filter === "all" || (filter === "pending" && !task.classList.contains("completed")) || (filter === "completed" && task.classList.contains("completed"))) {
                task.style.display = "list-item";
            } else {
                task.style.display = "none";
            }
        });
    }
     // Function to clear all tasks
     function clearAllTasks() {
        taskList.innerHTML = ""; // Remove all tasks
        saveTasks();
    }

    // Add event listener to the "Clear All" button
    clearAllButton.addEventListener("click", clearAllTasks);

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed"),
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text);
            if (task.completed) {
                taskItem.classList.add("completed");
                taskItem.querySelector(".complete").checked = true;
            }
            taskList.appendChild(taskItem);
        });
    }

    // Add event listener to the "Add" button
    addTaskButton.addEventListener("click", addTask);

    // Add event listener to the "Enter" key in the input field
    taskInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Add event listener to the filter dropdown
    filterDropdown.addEventListener("change", filterTasks);

    // Load tasks from local storage on page load
    loadTasks();
});
