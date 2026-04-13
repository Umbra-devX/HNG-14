
const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

const dueDate = new Date("2026-04-10T17:00:00");


function makeTimeRemaining() {
  const now = new Date();
  const diff = dueDate - now;

  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff > 0) {
    if (minutes < 1) return "Due now!";
    if (minutes < 60) return `Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  } else {
    if (minutes < 60) return `Overdue by ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `Overdue by ${hours} hour${hours !== 1 ? 's' : ''}`;
    return `Overdue by ${days} day${days !== 1 ? 's' : ''}`;
  }
}

function updateTime() {
  timeRemainingEl.textContent = makeTimeRemaining();
}

updateTime();

setInterval(updateTime, 60000);

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    title.style.textDecoration = "line-through";
    title.style.opacity = "0.6";
    status.textContent = "Done";
  } else {
    title.style.textDecoration = "none";
    title.style.opacity = "1";
    status.textContent = "In Progress";
  }
});

editBtn.addEventListener("click", () => {
  console.log("edit clicked");
  alert("Edit clicked");
});

deleteBtn.addEventListener("click", () => {
  console.log("delete clicked");
  alert("Delete clicked");
});
