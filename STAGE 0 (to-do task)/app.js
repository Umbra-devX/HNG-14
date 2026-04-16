const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const desc = document.querySelector('[data-testid="test-todo-description"]');
const priority = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"] span');
const statusText = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"] span');
const overdueEl = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const descSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
const card = document.querySelector('.card');

let dueDate = new Date("2026-04-10T17:00:00");
let isEditing = false;
let isExpanded = false;
let original = {};

function updatePriorityVisual(value) {
  priorityIndicator.className = `priority-indicator ${value.toLowerCase()}`;
  priority.className = `badge ${value.toLowerCase()}`;
}

function updateStatus(value) {
  statusText.textContent = value;
  statusControl.value = value;

  checkbox.checked = value === "Done";
  card.classList.toggle("done", value === "Done");
}

checkbox.addEventListener("change", () => {
  updateStatus(checkbox.checked ? "Done" : "Pending");
});

statusControl.addEventListener("change", () => {
  updateStatus(statusControl.value);
});

function makeTime() {
  if (statusText.textContent === "Done") return "Completed";

  const now = new Date();
  const diff = dueDate - now;

  overdueEl.classList.toggle("hidden", diff > 0);

  const abs = Math.abs(diff);
  const m = Math.floor(abs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (diff > 0) {
    if (m < 60) return `Due in ${m} minutes`;
    if (h < 24) return `Due in ${h} hours`;
    return `Due in ${d} days`;
  } else {
    if (m < 60) return `Overdue by ${m} minutes`;
    if (h < 24) return `Overdue by ${h} hours`;
    return `Overdue by ${d} days`;
  }
}

function updateTime() {
  timeRemainingEl.textContent = makeTime();
}

setInterval(updateTime, 30000);
updateTime();

expandBtn.addEventListener("click", () => {
  isExpanded = !isExpanded;

  descSection.style.maxHeight = isExpanded ? "none" : "40px";
  expandBtn.textContent = isExpanded ? "Show less" : "Show more";
  expandBtn.setAttribute("aria-expanded", isExpanded);
});

editBtn.addEventListener("click", () => {
  if (!isEditing) enterEdit();
  else saveEdit();
});

deleteBtn.addEventListener("click", () => {
  if (isEditing) cancelEdit();
  else card.remove();
});

function enterEdit() {
  isEditing = true;
  card.classList.add("editing");

  original = {
    title: title.textContent,
    desc: desc.textContent,
    priority: priority.textContent,
    date: dueDate.toISOString().slice(0,16)
  };

  title.innerHTML = `<input value="${original.title}" data-testid="test-todo-edit-title-input">`;
  desc.innerHTML = `<textarea data-testid="test-todo-edit-description-input">${original.desc}</textarea>`;
  priority.innerHTML = `
    <select data-testid="test-todo-edit-priority-select">
      <option ${original.priority==="Low"?"selected":""}>Low</option>
      <option ${original.priority==="Medium"?"selected":""}>Medium</option>
      <option ${original.priority==="High"?"selected":""}>High</option>
    </select>
  `;

  dueDateEl.innerHTML = `<input type="datetime-local" value="${original.date}" data-testid="test-todo-edit-due-date-input">`;

  editBtn.innerHTML = "Save";
  editBtn.setAttribute("data-testid","test-todo-save-button");

  deleteBtn.innerHTML = "Cancel";
  deleteBtn.setAttribute("data-testid","test-todo-cancel-button");
}

function saveEdit() {
  const newTitle = title.querySelector("input").value;
  const newDesc = desc.querySelector("textarea").value;
  const newPriority = priority.querySelector("select").value;
  const newDate = dueDateEl.querySelector("input").value;

  title.textContent = newTitle;
  desc.textContent = newDesc;
  priority.textContent = newPriority;
  dueDate = new Date(newDate);

  dueDateEl.textContent = new Date(newDate).toDateString();

  updatePriorityVisual(newPriority);

  exitEdit();
}

function cancelEdit() {
  title.textContent = original.title;
  desc.textContent = original.desc;
  priority.textContent = original.priority;
  dueDate = new Date(original.date);
  dueDateEl.textContent = new Date(original.date).toDateString();

  updatePriorityVisual(original.priority);

  exitEdit();
}

function exitEdit() {
  isEditing = false;
  card.classList.remove("editing");

  editBtn.innerHTML = `<i class="fa-solid fa-pen"></i><span>Edit</span>`;
  editBtn.setAttribute("data-testid","test-todo-edit-button");

  deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i><span>Delete</span>`;
  deleteBtn.setAttribute("data-testid","test-todo-delete-button");
}