let total = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function renderExpenses() {
  const expenseList = document.getElementById("expenses");
  expenseList.innerHTML = "";
  total = 0;
  expenses.forEach((expense, index) => {
    total += expense.amount;
    const expenseItem = document.createElement("div");
    expenseItem.classList.add("expense-item");
    expenseItem.innerHTML = `<span>${expense.desc} (${expense.category})</span> 
                                  <span>Rs.${expense.amount.toFixed(2)}</span> 
                                  <button onclick="removeExpense(${index})">X</button>`;
    expenseList.appendChild(expenseItem);
  });
  document.getElementById("total").innerText = total.toFixed(2);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addExpense() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  if (desc === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and amount");
    return;
  }
  expenses.push({ desc, amount, category });
  renderExpenses();
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function removeExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

window.onload = renderExpenses;
