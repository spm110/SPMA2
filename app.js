const dateOptions = document.querySelector("#date-options");
const timeOptions = document.querySelector("#time-options");
const selectedDateLabel = document.querySelector("#selected-date-label");
const selectionMessage = document.querySelector("#selection-message");
const continueButton = document.querySelector("#continue-button");

const appointments = [
  ["9:00 AM", "10:30 AM", "2:00 PM"],
  ["8:30 AM", "11:00 AM", "3:30 PM"],
  ["9:30 AM", "1:00 PM", "4:00 PM"],
  ["10:00 AM", "11:30 AM", "2:30 PM"],
];

const formatDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const formatWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const formatMonth = new Intl.DateTimeFormat("en-US", { month: "short" });
const availableDates = [];
let activeDateIndex = 0;
let activeTime = null;

for (let offset = 1; availableDates.length < 4; offset += 1) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  if (date.getDay() !== 0) availableDates.push(date);
}

function renderTimes() {
  const date = availableDates[activeDateIndex];
  selectedDateLabel.textContent = formatDate.format(date);
  activeTime = null;
  continueButton.disabled = true;
  selectionMessage.textContent = "Select a time to continue.";
  timeOptions.replaceChildren();

  appointments[activeDateIndex].forEach((time) => {
    const button = document.createElement("button");
    button.className = "time-option";
    button.type = "button";
    button.textContent = time;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      timeOptions.querySelectorAll(".time-option").forEach((option) => option.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      activeTime = time;
      continueButton.disabled = false;
      selectionMessage.textContent = `${formatDate.format(date)} at ${time} selected.`;
    });
    timeOptions.append(button);
  });
}

availableDates.forEach((date, index) => {
  const button = document.createElement("button");
  button.className = "date-option";
  button.type = "button";
  button.setAttribute("aria-pressed", String(index === activeDateIndex));
  button.setAttribute("aria-label", formatDate.format(date));
  button.innerHTML = `<span>${formatWeekday.format(date)}</span><strong>${date.getDate()}</strong><span>${formatMonth.format(date)}</span>`;
  button.addEventListener("click", () => {
    activeDateIndex = index;
    dateOptions.querySelectorAll(".date-option").forEach((option, optionIndex) => {
      option.setAttribute("aria-pressed", String(optionIndex === index));
    });
    renderTimes();
  });
  dateOptions.append(button);
});

continueButton.addEventListener("click", () => {
  if (!activeTime) return;
  selectionMessage.textContent = `Ready to book ${formatDate.format(availableDates[activeDateIndex])} at ${activeTime}.`;
});

renderTimes();