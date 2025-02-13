document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let taskDate = document.getElementById("taskDate").value;
    let taskTime = document.getElementById("taskTime").value;
    let priority = document.getElementById("priority").value;
    let category = document.getElementById("category").value;

    if (taskInput === "" || taskDate === "" || taskTime === "") {
        alert("⚠ Please enter a task, set a due date, and specify a time!");
        return;
    }

    let task = { text: taskInput, date: taskDate, time: taskTime, priority, category, completed: false };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskTime").value = "";
}

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

        let [hours, minutes] = task.time.split(":");
        let formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        let row = document.createElement("tr");
        row.innerHTML = `
            <td class="${task.completed ? 'completed' : ''}">${task.text}</td>
            <td>${formattedDate} - ${formattedTime}</td>
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

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let newText = prompt("Edit Task:", tasks[index].text);
    if (newText) {
        tasks[index].text = newText.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

let chartInstance = null;
function updateChart(categories) {
    let ctx = document.getElementById("taskChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
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
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 10 }
            }
        }
    });
}
