// ===============================
// 1️⃣ DOM SELECTION (INITIAL SETUP)
// ===============================

// Select all kanban columns
const sectionColumns = document.querySelectorAll(".section-columns");

// Select individual columns
const progress = document.getElementById("progress");
const todo = document.getElementById("todo");
const done = document.getElementById("done");

// Select tasks that already exist in HTML (only at initial load)
const task = document.querySelectorAll(".task");

// Select UI buttons
const addTaskBtn = document.querySelector(".addTaskBtn");
const closeFormBtn = document.querySelector(".closeFormBtn");

// Variable to store the currently dragged task
let draggedItem = null;

// ===============================
// 2️⃣ DATA & STORAGE INITIALIZATION
// ===============================

// Object that will store tasks column-wise
const tasksData = {};

// Load tasks from localStorage when page loads
if (localStorage.getItem("tasksData")) {
  const savedData = JSON.parse(localStorage.getItem("tasksData"));

  // Loop through each saved column
  for (const colId in savedData) {
    const column = document.getElementById(colId);

    // Re-create each task inside its column
    savedData[colId].forEach(({ title, description }) => {
      taskUpdate(title, description, column);
    });
  }
}

// ===============================
// 3️⃣ COMMON REFERENCES
// ===============================

// Array of all columns (used for counting & saving)
const allColumns = [todo, progress, done];

// Task form reference
const form = document.getElementById("taskForm");

// ===============================
// 4️⃣ FORM SUBMISSION (ADD TASK)
// ===============================

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  // Read input values using FormData
  const formData = new FormData(form);
  const title = formData.get("taskTitle");
  const description = formData.get("taskDescription");

  // Create a new task in Todo column
  taskUpdate(title, description);

  // Close popup and reset form
  closewindow();
  form.reset();
});

// ===============================
// 5️⃣ DRAG SETUP FOR EXISTING TASKS
// ===============================

// Attach drag event to tasks already present in DOM
task.forEach((element) => {
  element.addEventListener("drag", () => {
    draggedItem = element;
  });
});

// ===============================
// 6️⃣ ENABLE DRAG & DROP ON COLUMNS
// ===============================

drag_handler(todo);
drag_handler(done);
drag_handler(progress);

// ===============================
// 7️⃣ OPEN / CLOSE ADD TASK WINDOW
// ===============================

// Open add task popup
addTaskBtn.addEventListener("click", () => {
  const addTaskWindow = document.querySelector(".addTaskWindow");
  addTaskWindow.style.display = "flex";
});

// Close add task popup
closeFormBtn.addEventListener("click", () => {
  closewindow();
});

// ===============================
// 8️⃣ CLOSE WINDOW FUNCTION
// ===============================

// Closes add task popup and sync data
function closewindow() {
  const addTaskWindow = document.querySelector(".addTaskWindow");
  addTaskWindow.style.display = "none";
  updateTaskCounts();
}

// ===============================
// 9️⃣ DRAG & DROP HANDLER
// ===============================

// Handles drag behaviour for each column
function drag_handler(column) {
  // Required to allow dropping
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // Visual feedback when task enters column
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  // Remove hover effect when task leaves column
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  // Drop task into column
  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (draggedItem) {
      column.appendChild(draggedItem);
      column.classList.remove("hover-over");
    }

    // Update UI and storage after drop
    updateTaskCounts();
  });
}

// ===============================
// 🔟 UPDATE COUNTS & LOCALSTORAGE
// ===============================

// Sync task count, data object, and localStorage
function updateTaskCounts() {
  allColumns.forEach((col) => {
    // Get all tasks in the column
    const tasksInCol = col.querySelectorAll(".task");

    // Update task count badge
    const count = col.querySelector(".task-count");
    count.textContent = tasksInCol.length;

    // Store task details for persistence
    tasksData[col.id] = Array.from(tasksInCol).map((t) => ({
      title: t.querySelector("h3").textContent,
      description: t.querySelector("p").textContent,
    }));
  });

  // Save updated state to localStorage
  localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

// ===============================
// 1️⃣1️⃣ INITIAL COUNT SYNC
// ===============================

// Ensure correct counts on first load
updateTaskCounts();

// ===============================
// 1️⃣2️⃣ TASK CREATION FUNCTION
// ===============================

// Creates a new draggable task
function taskUpdate(title, description, column = todo) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.setAttribute("draggable", "true");

  // Task UI structure
  taskDiv.innerHTML = `
    <div class="upper">
      <h3>${title}</h3>
      <button class="taskDltBtn">Delete</button>
    </div>
    <div class="lower">
      <p>${description}</p>
    </div>
  `;

  // Add task to column
  column.appendChild(taskDiv);

  // Track task while dragging
  taskDiv.addEventListener("drag", () => {
    draggedItem = taskDiv;
  });

  // Delete task functionality
  const deleteBtn = taskDiv.querySelector(".taskDltBtn");
  deleteBtn.addEventListener("click", () => {
    taskDiv.remove();
    updateTaskCounts();
  });
}
