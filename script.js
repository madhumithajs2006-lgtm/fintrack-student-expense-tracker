const description=document.getElementById("description");
const exportBtn=document.getElementById("exportBtn");
const themeBtn=document.getElementById("themeBtn");
const amount=document.getElementById("amount");

const type=document.getElementById("type");

const category=document.getElementById("category");

const addBtn=document.getElementById("addBtn");

const balance=document.getElementById("balance");

const transactionList=document.getElementById("transactionList");
const searchInput=document.getElementById("searchInput");
let transactions=JSON.parse(localStorage.getItem("transactions")) || [];
let expenseChart;
renderTransactions();

addBtn.addEventListener("click",addTransaction);
searchInput.addEventListener("input",renderTransactions);
function addTransaction(){

const desc=description.value.trim();

const amt=Number(amount.value);

if(desc==="" || amt<=0){

alert("Enter valid details");

return;

}

const transaction={

id:Date.now(),

description:desc,

amount:amt,

type:type.value,

category:category.value

};

transactions.push(transaction);

saveData();

renderTransactions();

description.value="";

amount.value="";

}

function renderTransactions(){

transactionList.innerHTML="";

let total=0;
let income=0;

let expense=0;
const search=searchInput.value.toLowerCase();

const filteredTransactions=transactions.filter(item=>

item.description.toLowerCase().includes(search)

||

item.category.toLowerCase().includes(search)

);

filteredTransactions.forEach(item=>{
if(item.type==="income"){

income+=item.amount;

}

else{

expense+=item.amount;

}
if(item.type==="income"){

total+=item.amount;

}else{

total-=item.amount;

}

const li=document.createElement("li");

li.classList.add("transaction");

li.classList.add(item.type);

li.innerHTML=`

<div>

<h3>${item.description}</h3>

<p>${item.category}</p>

</div>

<div>

<h3>₹${item.amount}</h3>

<button class="deleteBtn"

onclick="deleteTransaction(${item.id})">

🗑️

</button>

</div>

`;

transactionList.appendChild(li);

});

balance.innerText=`₹${total}`;
incomeTotal.innerText=`₹${income}`;

expenseTotal.innerText=`₹${expense}`;
updateChart();
}

function deleteTransaction(id){

transactions=transactions.filter(

item=>item.id!==id

);

saveData();

renderTransactions();

}

function saveData(){

localStorage.setItem(

"transactions",

JSON.stringify(transactions)

);

}
function updateChart(){

const categoryTotals={};

transactions.forEach(item=>{

if(item.type==="expense"){

if(categoryTotals[item.category]){

categoryTotals[item.category]+=item.amount;

}

else{

categoryTotals[item.category]=item.amount;

}

}

});

const labels=Object.keys(categoryTotals);

const values=Object.values(categoryTotals);

if(expenseChart){

expenseChart.destroy();

}

const ctx=document.getElementById("expenseChart");

expenseChart=new Chart(ctx,{

type:"doughnut",

data:{

labels:labels,

datasets:[{

data:values

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);

}
themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

themeBtn.innerHTML="☀️ Light Mode";

}

else{

themeBtn.innerHTML="🌙 Dark Mode";

}

});
exportBtn.addEventListener("click",exportCSV);

function exportCSV(){

if(transactions.length===0){

alert("No transactions to export");

return;

}

let csv="Description,Amount,Type,Category\n";

transactions.forEach(item=>{

csv+=`${item.description},${item.amount},${item.type},${item.category}\n`;

});

const blob=new Blob([csv],{

type:"text/csv"

});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="fintrack-data.csv";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

}