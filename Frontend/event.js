document.addEventListener("DOMContentLoaded", function() {
    loadEvents();
});

// Function to show the event form
function showEventForm() {
    document.getElementById("event-form").style.display = "block";
}

// Function to hide the event form
function hideEventForm() {
    document.getElementById("event-form").style.display = "none";
}

// Function to add a new event
function addEvent() {
    let title = document.getElementById("event-title").value;
    let date = document.getElementById("event-date").value;
    let desc = document.getElementById("event-desc").value;

    if (title === "" || date === "" || desc === "") {
        alert("Please fill in all fields!");
        return;
    }

    let eventContainer = document.getElementById("event-container");

    let newEvent = document.createElement("div");
    newEvent.classList.add("hackathon-card");

    newEvent.innerHTML = `
        <h3>${title}</h3>
        <p class="event-date">📅 ${date}</p>
        <p class="event-desc">${desc}</p>
        <button class="register-btn">Register</button>
    `;

    eventContainer.appendChild(newEvent);

    // Save event in local storage
    saveEvent({ title, date, desc });

    // Clear form fields & hide the form
    document.getElementById("event-title").value = "";
    document.getElementById("event-date").value = "";
    document.getElementById("event-desc").value = "";
    hideEventForm();
}

// Function to save events in local storage
function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));
}

// Function to load events from local storage
function loadEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let eventContainer = document.getElementById("event-container");

    events.forEach(event => {
        let newEvent = document.createElement("div");
        newEvent.classList.add("hackathon-card");

        newEvent.innerHTML = `
            <h3>${event.title}</h3>
            <p class="event-date">📅 ${event.date}</p>
            <p class="event-desc">${event.desc}</p>
            <button class="register-btn">Register</button>
        `;

        eventContainer.appendChild(newEvent);
    });
}

// Function to search events
function searchEvents() {
    let searchText = document.getElementById("search-bar").value.toLowerCase();
    let events = document.querySelectorAll(".hackathon-card");

    events.forEach(event => {
        let title = event.querySelector("h3").innerText.toLowerCase();
        if (title.includes(searchText)) {
            event.style.display = "block";
        } else {
            event.style.display = "none";
        }
    });
}



// scroll button
const scrollBtn = document.getElementById("scrollToTop");
        
window.onscroll = function() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        scrollBtn.style.display = "flex";
    } else {
        scrollBtn.style.display = "none";
    }
};

scrollBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
