// let taskData = {};

// const todo = document.querySelector("#todo");
// const progress = document.querySelector("#progress");
// const done = document.querySelector("#done");
// let draggElement = null;
// columnns = document.querySelectorAll('.task-column');
// console.log(todo, progress, done);


// function addtask(title,desc,column)
// {
//     const div = document.createElement("div");

//     div.classList.add("task");
//     div.setAttribute("draggable", "true");
//     div.innerHTML = `
//                      <h3>${title}</h3>
//                      <p>${desc}</p>
//                         <button>Delete</button>`
//     column.appendChild(div);
//     div.addEventListener("drag", (e) => {
//         draggElement = div;
//     });

//     return div;
// }

// function updatetask()
// {
//       columnns.forEach(col => {
//             const tasksInCol = col.querySelectorAll('.task');
//             const count = col.querySelector('.right');

//             taskData[col.id] = Array.from(tasksInCol).map(task => ({
//                 title: task.querySelector('h3').textContent,
//                 desc: task.querySelector('p').textContent,
//             }));

//             localStorage.setItem('tasksData', JSON.stringify(taskData));
//             count.textContent = tasksInCol.length;
//         });
// }

// if (localStorage.getItem('tasksData')) {
//     taskData = JSON.parse(localStorage.getItem('tasksData'));

//     for (const column in taskData) {
//         const columnElement = document.querySelector(`#${column}`);
//         taskData[column].forEach(task => {
//             addtask(task.title, task.desc, columnElement);
//         })
//         updatetask();
//     }
// }

// const tasks = document.querySelectorAll('.task');

// tasks.forEach(tasks => {
//     tasks.addEventListener("drag", (e) => {
        
//         draggElement = tasks;

//     })
// })


// function addDragEventSonColumn(column) {
//     column.addEventListener("dragover", (e) => {
//         e.preventDefault();
//         column.classList.add("hover-over");
//     })
//     column.addEventListener("dragleave", (e) => {
//         e.preventDefault();
//         column.classList.remove("hover-over");
//     })

//     column.addEventListener("dragover", (e) => {
//         e.preventDefault();
//     });

//     column.addEventListener("drop", (e) => {
//         e.preventDefault();

//         column.appendChild(draggElement);
//         column.classList.remove("hover-over");
//         updatetask();
//     });

// }

// addDragEventSonColumn(todo);
// addDragEventSonColumn(progress);
// addDragEventSonColumn(done);


// const toggleModalBtn = document.querySelector("#toggle-modal");
// const modal = document.querySelector(".modal");
// const modalBg = document.querySelector(".modal .bg");
// const addnewTaskBtn = document.querySelector("#add-new-task");

// toggleModalBtn.addEventListener("click", () => {
//     modal.classList.toggle("active");
// });

// modalBg.addEventListener("click", () => {
//     modal.classList.remove("active");
// });

// addnewTaskBtn.addEventListener("click", () => {
//     const TaskTitle = document.querySelector("#add-title-input").value;
//     const TaskDesc = document.querySelector("#task-desc-input").value;

//     const div = addtask(TaskTitle, TaskDesc, todo);
//     updatetask();
//     div.addEventListener("drag", (e) => {
//         draggElement = div;
//     })

//     modal.classList.remove("active");

// });
let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let draggElement = null;
const columnns = document.querySelectorAll('.task-column');
console.log(todo, progress, done);

// Helper to update localStorage and column counts
function updatetask() {
    columnns.forEach(col => {
        const tasksInCol = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        // Update taskData for the column
        taskData[col.id] = Array.from(tasksInCol).map(task => ({
            title: task.querySelector('h3').textContent,
            desc: task.querySelector('p').textContent,
        }));

        count.textContent = tasksInCol.length;
    });
    // Save the entire structure to localStorage after all columns are processed
    localStorage.setItem('tasksData', JSON.stringify(taskData));
}


function addtask(title, desc, column) {
    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>`; // Added class for easier selection
    
    column.appendChild(div);

    // 1. Attach drag event (Crucial for all tasks, new or loaded)
    div.addEventListener("dragstart", (e) => { // Use dragstart for better tracking
        draggElement = div;
        e.dataTransfer.effectAllowed = "move";
    });

    // 2. Attach delete event
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        div.remove(); // Remove the element from the DOM
        updatetask(); // Update the stored data
    });

    return div;
}

// === Task Loading from localStorage ===
if (localStorage.getItem('tasksData')) {
    taskData = JSON.parse(localStorage.getItem('tasksData'));

    for (const columnId in taskData) {
        const columnElement = document.querySelector(`#${columnId}`);
        // Ensure the column element exists before trying to add tasks to it
        if (columnElement) {
            taskData[columnId].forEach(task => {
                // addtask handles element creation and event binding
                addtask(task.title, task.desc, columnElement);
            });
        }
    }
    // Update counts and re-save after loading everything
    updatetask(); 
}

// REMOVED: The problematic code block that queried tasks before they were loaded.

// === Drag and Drop Column Logic ===
function addDragEventSonColumn(column) {
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        
        // Ensure we are dropping a valid draggable element
        if (draggElement) {
            column.appendChild(draggElement);
            column.classList.remove("hover-over");
            updatetask(); // Update localStorage after a task moves
            draggElement = null; // Clear the dragged element
        }
    });
}

addDragEventSonColumn(todo);
addDragEventSonColumn(progress);
addDragEventSonColumn(done);


// === Modal and New Task Creation Logic ===
const toggleModalBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addnewTaskBtn = document.querySelector("#add-new-task");

toggleModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addnewTaskBtn.addEventListener("click", () => {
    const TaskTitle = document.querySelector("#add-title-input").value;
    const TaskDesc = document.querySelector("#task-desc-input").value;

    if (!TaskTitle || !TaskDesc) {
        alert("Please enter both a title and description.");
        return;
    }

    // Add task to the 'todo' column and attach all its events
    addtask(TaskTitle, TaskDesc, todo); 
    
    // Update the task data in localStorage and the column counts
    updatetask(); 

    // Clear inputs and close modal
    document.querySelector("#add-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
    modal.classList.remove("active");

});