let members = [];

function addMember() {
    let name = document.getElementById("name").value.trim();
    let skills = document.getElementById("skills").value.trim();
    let github = document.getElementById("github").value.trim();
    let linkedin = document.getElementById("linkedin").value.trim();
    let role = document.getElementById("role").value;
    let profilePicInput = document.getElementById("profilePic");

    if (!name || !skills) {
        alert("Please enter valid details.");
        return;
    }

    let profilePicURL = "";
    if (profilePicInput.files.length > 0) {
        let file = profilePicInput.files[0];
        profilePicURL = URL.createObjectURL(file);
    }

    let newMember = { name, skills, github, linkedin, role, profilePicURL };
    members.push(newMember);
    displayMembers();
}

function displayMembers() {
    let membersList = document.getElementById("membersList");
    membersList.innerHTML = "";
    members.forEach((member, index) => {
        let memberDiv = document.createElement("div");
        memberDiv.classList.add("member");

        let img = document.createElement("img");
        img.src = member.profilePicURL || "https://via.placeholder.com/50";

        let infoDiv = document.createElement("div");
        infoDiv.classList.add("member-info");
        infoDiv.innerHTML = `<strong>${member.name}</strong><br>Role: ${member.role}<br>Skills: ${member.skills}`;

        let linksDiv = document.createElement("div");
        linksDiv.classList.add("member-links");

        if (member.github) {
            let githubLink = `<a href="${member.github}" class="github" target="_blank">GitHub</a>`;
            linksDiv.innerHTML += githubLink;
        }

        if (member.linkedin) {
            let linkedinLink = `<a href="${member.linkedin}" class="linkedin" target="_blank">LinkedIn</a>`;
            linksDiv.innerHTML += linkedinLink;
        }

        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            members.splice(index, 1);
            displayMembers();
        };

        memberDiv.append(img, infoDiv, linksDiv, deleteBtn);
        membersList.appendChild(memberDiv);
    });
}
function sortMembers() {
    let sortBy = document.getElementById("sort").value;
    members.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    displayMembers();
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