document.addEventListener("DOMContentLoaded", loadDoubts);

function postDoubt() {
    let doubtInput = document.getElementById("doubt-input").value;
    if (doubtInput.trim() === "") return alert("Please enter a doubt!");

    let doubts = JSON.parse(localStorage.getItem("doubts")) || [];
    doubts.push(doubtInput);
    localStorage.setItem("doubts", JSON.stringify(doubts));

    document.getElementById("doubt-input").value = "";
    loadDoubts();
}

function loadDoubts() {
    let doubtList = document.getElementById("doubt-list");
    doubtList.innerHTML = "";

    let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

    doubts.forEach((doubt, index) => {
        let doubtDiv = document.createElement("div");
        doubtDiv.classList.add("doubt");
        doubtDiv.innerHTML = `<p>${doubt}</p> 
                              <button onclick="deleteDoubt(${index})">❌</button>`;
        doubtList.appendChild(doubtDiv);
    });
}

function deleteDoubt(index) {
    let doubts = JSON.parse(localStorage.getItem("doubts")) || [];
    doubts.splice(index, 1);
    localStorage.setItem("doubts", JSON.stringify(doubts));
    loadDoubts();
}
