document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

/* Add Task */
function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let taskDate = document.getElementById("taskDate").value;
    let priority = document.getElementById("priority").value;
    let category = document.getElementById("category").value;

    if (taskInput === "" || taskDate === "") {
        alert("⚠ Please enter a task and set a due date!");
        return;
    }

    let task = { text: taskInput, date: taskDate, priority, category, completed: false };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
}

/* Load & Render Tasks */
function loadTasks() {
    renderTasks();
}

function renderTasks() {
    let taskTableBody = document.getElementById("taskTableBody");
    taskTableBody.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let categories = { work: 0, personal: 0, study: 0 };

    tasks.forEach((task, index) => {
        if (!task.completed) {
            categories[task.category]++;
        }

        let formattedDate = new Date(task.date).toLocaleDateString("en-GB");

        let row = document.createElement("tr");
        row.innerHTML = `
            <td class="${task.completed ? 'completed' : ''}">${task.text}</td>
            <td>${formattedDate}</td>
            <td class="${task.priority}">
                ${task.priority === "high" ? "🔥 <b>High</b>" : 
                  task.priority === "medium" ? "⚡ <b>Medium</b>" : 
                  "🌱 <b>Low</b>"}
            </td>
            <td>${task.category === "work" ? "💼 Work" : task.category === "personal" ? "🏡 Personal" : "📚 Study"}</td>
            <td>
                <button onclick="editTask(${index})">✏ Edit</button>
                <button onclick="toggleComplete(${index})">${task.completed ? "✅" : "✔ Done"}</button>
                <button onclick="deleteTask(${index})">❌ Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });

    updateChart(categories);
}

/* Edit Task */
function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let newText = prompt("Edit Task:", tasks[index].text);
    if (newText) {
        tasks[index].text = newText.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

/* Toggle Completed Task */
function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

/* Delete Task */
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

/* Updated Task Progress Bar Graph */
let chartInstance = null;
function updateChart(categories) {
    let ctx = document.getElementById("taskChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy(); // Clear previous chart before updating
    }

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Work", "Personal", "Study"],
            datasets: [{
                data: [categories.work, categories.personal, categories.study],
                backgroundColor: ["blue", "green", "orange"]
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 10 }
            }
        }
    });
}