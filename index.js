const form = document.querySelector(".add");
const warning = document.querySelector(".add p");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];
transactions=transactions.map(transaction => {
  const newAmount=Number(transaction.amount);
  return {source:transaction.source, amount:newAmount,id:transaction.id,date:transaction.date};
});
function updatedStats() {
  const updatedIncome = transactions.filter(transaction => transaction.amount > 0).reduce((acc, curr) => {
    acc = (acc + curr.amount);
    return acc;
  }, 0)
  console.log(updatedIncome);
  income.innerText = `${updatedIncome}`;
  const updatedExpense = transactions.filter(transaction => transaction.amount < 0).reduce((acc, curr) => {
    acc = Math.abs(acc + curr.amount);
    return acc;
  }, 0)
  console.log(updatedExpense);
  expense.innerText = `${updatedExpense}`;
  const updatedBalance = updatedIncome - updatedExpense;
  console.log(updatedBalance);
  balance.innerText = `${updatedBalance}`;
}
updatedStats();
function GenerateTemplate(id, source, amount, time) {
  return ` <li data-id="${id}">
                    <p><span>${source}</span><span id="time">${time}</span></p>
                    $<span>${Math.abs(amount)}</span>
                    <i class="bi bi-trash delete"></i>
                  </li>
               `;
}
function addTransactionDom(id, source, amount, time) {
  if (source.trim() === "") {
warning.textContent="please enter a valid source !"
    warning.setAttribute("class", "warning-source");
  }
  else if (amount >= 0) {
    incomeList.innerHTML += GenerateTemplate(id, source, amount, time);
  } else if(amount<0){
    expenseList.innerHTML += GenerateTemplate(id, source, amount, time);
  }
}
form.addEventListener("keyup", e => {
  const value = form.source.value;
  if (value.length!==0){
    warning.textContent = "";
    warning.classList.remove("warning-source");
  }
})
function addTransaction(source, amount) {
  const date = new Date();
  const transaction = {
    source: source,
    amount: Number(amount),
    id: Math.round(Math.random() * 100000),
    date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDom(
    transaction.id,
    transaction.source,
    transaction.amount,
    transaction.date
  );
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTransaction(form.source.value, form.amount.value);
  updatedStats();
  if (!warning.classList.contains("warning-source")){
    form.reset();
  }
});
function getTransactions() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += GenerateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.date
      );
    } else {
      expenseList.innerHTML += GenerateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.date
      );
    }
  });
}
getTransactions();
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    removeTransaction(Number(event.target.parentElement.dataset.id));
    updatedStats();

  }
});
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    removeTransaction(Number(event.target.parentElement.dataset.id));
    updatedStats();

  }

});
