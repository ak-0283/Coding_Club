const GITHUB_USER = "ak-0283";
const GITHUB_REPO = "Coding_Club";
const apiURL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contributors`;
let contributorsData = [];

async function fetchContributors() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    contributorsData = await response.json();
    displayTeam(contributorsData);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    document.getElementById("teamContainer").innerHTML =
      "<p>Failed to load contributors.</p>";
  }
}
function filterTeam() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const filtered = contributorsData.filter((member) =>
    member.login.toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    displayNoResults();
  } else {
    displayTeam(filtered);
  }
}
function displayTeam(contributors) {
  const teamContainer = document.getElementById("teamContainer");
  teamContainer.innerHTML = "";
  contributors.forEach((member) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${member.avatar_url}" alt="${member.login}">
        <h3>${member.login}</h3>
        <a href="${member.html_url}" target="_blank">View GitHub Profile</a>
        `;
    teamContainer.appendChild(card);
  });
}

function displayNoResults() {
  const teamContainer = document.getElementById("teamContainer");
  teamContainer.innerHTML = "<p>No contributor with this name exists.</p>";
}

fetchContributors();
