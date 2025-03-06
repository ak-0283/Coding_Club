document.addEventListener("DOMContentLoaded", loadNotes);

function addNote() {
  let noteText = document.getElementById("noteInput").value;
  if (noteText.trim() === "") return;
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(noteText);
  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById("noteInput").value = "";
  showNotification("Note Added!");
  loadNotes();
}

function loadNotes() {
  let notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note, index) => {
    let noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    let noteContent = document.createElement("div");
    noteContent.classList.add("note-content");
    noteContent.textContent = note;

    let noteButtons = document.createElement("div");
    noteButtons.classList.add("note-buttons");

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.textContent = "Edit";
    editButton.onclick = () => editNote(index);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.textContent = "X";
    deleteButton.onclick = () => deleteNote(index);

    noteButtons.appendChild(editButton);
    noteButtons.appendChild(deleteButton);

    noteDiv.appendChild(noteContent);
    noteDiv.appendChild(noteButtons);

    notesContainer.appendChild(noteDiv);
  });
}

function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotification("Note Deleted!");
  loadNotes();
}

function editNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let newNote = prompt("Edit your note:", notes[index]);
  if (newNote !== null && newNote.trim() !== "") {
    notes[index] = newNote;
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotification("Note Updated!");
    loadNotes();
  }
}

function showNotification(message) {
  let notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.background = "#28a745";
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

// Theme Toggle
if (toggleTheme) {
  toggleTheme.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Save theme preference
    const isDarkMode = document.body.classList.contains("dark-mode");
    toggleTheme.textContent = isDarkMode ? "☀️" : "🌙";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // Load theme preference on page load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleTheme.textContent = "☀️";
  }
}

