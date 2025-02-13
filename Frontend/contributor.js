document.addEventListener("DOMContentLoaded", () => {
    fetch("team.json")
        .then(response => response.json())
        .then(data => displayTeam(data))
        .catch(error => console.error("Error loading team data:", error));
});

function displayTeam(team) {
    const teamContainer = document.getElementById("teamContainer");
    teamContainer.innerHTML = ""; // Clear previous content

    team.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
            <div class="contributors">
                <a href="${member.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${member.linkedin}" target="_blank">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
            </div>
        `;
        teamContainer.appendChild(card);
    });
}

function filterTeam() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    fetch("team.json")
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(member =>
                member.name.toLowerCase().includes(searchQuery) ||
                member.role.toLowerCase().includes(searchQuery)
            );
            displayTeam(filtered);
        });
}
