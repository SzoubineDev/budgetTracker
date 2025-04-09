const form = document.querySelector(".add");
const warning = document.querySelector(".add p");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
// parsing  data from local storage
let transactions =
    localStorage.getItem("transactions") !== null
        ? JSON.parse(localStorage.getItem("transactions"))
        : [];
//amount should be a number type
transactions=transactions.map(transaction => {
  const newAmount=Number(transaction.amount);
  return {source:transaction.source, amount:newAmount,id:transaction.id,date:transaction.date};
});
//updating state function
function updatedStats() {
  const updatedIncome = transactions.filter(transaction => transaction.amount > 0).reduce((acc, curr) => {
    acc = (acc + curr.amount);
    return acc;
  }, 0)

  income.innerText = `${updatedIncome}`;
  const updatedExpense = transactions.filter(transaction => transaction.amount < 0).reduce((acc, curr) => {
    acc = Math.abs(acc + curr.amount);
    return acc;
  }, 0)

  expense.innerText = `${updatedExpense}`;
  const updatedBalance = updatedIncome - updatedExpense;

  balance.innerText = `${updatedBalance}`;
}
//updating stats after reload
updatedStats();
//generate HTMl template
function GenerateTemplate(id, source, amount, time) {
  return ` <li data-id="${id}">
                    <p><span>${source}</span><span id="time">${time}</span></p>
                    $<span>${Math.abs(amount)}</span>
                    <i class="bi bi-trash delete"></i>
                  </li>
               `;
}
//adding transaction to our website dom function
function addTransactionDom(id, source, amount, time) {
  if (source.trim() === "") {
    warning.textContent="please enter a valid source !"
    warning.setAttribute("class", "warning-source");
  } else if (amount>0){
    incomeList.innerHTML+=GenerateTemplate(id, source, amount,time);
  }else{
    expenseList.innerHTML+=GenerateTemplate(id, source, amount,time);
  }
}
// hiding warning after source input
form.addEventListener("keyup", () => {
  const value = form.source.value;
  const valueAmount = form.amount.value;
  if (value.length!==0&&valueAmount.length!==0){
    warning.textContent = "";
    warning.classList.remove("warning-source");
  }
})
//add transaction to local storage and calling the add transaction at dom function
function addTransaction(source, amount) {
  const date = new Date();
  const transaction = {
    source: source,
    amount: Number(amount),
    id: Math.round(Math.random() * 100000),
    date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
  };
  if (source.trim() === "" || amount ==="") {
    warning.textContent = "please enter a valid source !"
  }else{
    transactions.push(transaction);}
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDom(
      transaction.id,
      transaction.source,
      transaction.amount,
      transaction.date
  );
}
// submit and do all the transaction tasks (add transaction + appearing it at dom + updating stats)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTransaction(form.source.value, form.amount.value);
  updatedStats();
  if (form.source.value.trim()==="" || form.amount.value === ""){
    warning.classList.add("warning-source");
    warning.textContent="please enter a both source and amount !"
  }
  else if (!warning.classList.contains("warning-source")){
    form.reset();
  }
});
// getting transaction after reload and make them appear after reload
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
//remove a transaction from both local storage and dom after remove event using id passed in dataset
function removeTransaction(id) {
  //creating new array of items which are not deleted
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  //overriding the existed transactions in local storage with items in the new transactions array
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
// using click event to delete an income transaction
incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    removeTransaction(Number(event.target.parentElement.dataset.id));
    updatedStats();
  }
});
// using click event to delete an expense transaction
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    removeTransaction(Number(event.target.parentElement.dataset.id));
    updatedStats();

  }
});

// updateStats() is called after every event .