function get(id) {
  return document.getElementById(id);
}

const balance = get("balance"),
  moneyPlus = get("moneyPlus"),
  moneyMinus = get("moneyMinus"),
  list = get("list"),
  form = get("form"),
  text = get("text"),
  amount = get("amount"),
  type = get("type");

let transaction = JSON.parse(localStorage.getItem("transactions"));

transaction = transaction !== null ? transaction : [];

// Generate random ID
function generateID() {
  const id = Math.floor(Math.random() * 100000000);
  if (transaction) {
    transaction.forEach((item) => {
      return item.id === id ? generateID() : id;
    });
  }
  return id;
}

function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add class based on sign
  item.classList.add(sign === "+" ? "plus" : "minus");

  item.innerHTML = `
          ${transaction.text} 
          <span>${sign}${Math.abs(transaction.amount)}</span>
          <button class="delete-btn" 
          onclick="removeTransaction(${transaction.id})">X</button>
  `;

  list.appendChild(item);
}

// Add New transaction to localStorage and DOM

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" && amount.value.trim() === "") {
    alert("Enter a valid details");
    return;
  }

  const updatedAmountValue = `${type.value}${amount.value}`;

  const newTransaction = {
    id: generateID(),
    text: text.value,
    amount: +updatedAmountValue,
  };
  transaction.push(newTransaction);
  updateLocalStorage();
  init();
  text.value = "";
  amount.value = "";
}

// Remove transaction from DOM and localStorage
function removeTransaction(id) {
  transaction = transaction.filter((item) => item.id !== id);
  updateLocalStorage();
  init();
}

function init() {
  list.innerHTML = "";
  type.value = "+";

  transaction.forEach(addTransactionDOM);

  updateValues();
}

// Update localStorage according to the current transaction list
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transaction));
}

// Update balance, income and Expense
function updateValues() {
  const amounts = transaction.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, cur) => acc + cur, 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, cur) => (acc += cur), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, cur) => (acc += cur), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

init();

form.addEventListener("submit", addTransaction);
