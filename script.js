// let price = 1.87;
let price = 3.26;
let cid = [
  ["PENNY", 1.01], // 1 cent
  ["NICKEL", 2.05], // 5 cent
  ["DIME", 3.1], // 10 cent
  ["QUARTER", 4.25], // 25 cent
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];
// price = 19.5;
// cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];


let cash = 0;
let cidTotal = parseFloat(cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2));
const cidValues = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 100];

const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const output = document.getElementById("change-due");

const totalPrice = document.querySelector(".total");
const changeDiv = document.querySelector(".change");

const loadScreen = () => {
  totalPrice.textContent = `Total: $${price}`;
  changeDiv.innerHTML = "<h2>Change in drawer:</h2>";
  const cidNames = ["Pennies", "Nickels", "Dimes", "Quarters", "Ones", "Fives", "Tens", "Twenties", "Hundreds"]
  cid.forEach(([name, value], i) => {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase() + 's';
    changeDiv.innerHTML += `<p class="currency">${cidNames[i]}: $${value.toFixed(2)}<p>`;
  })
}

const handleInput = () => {
  cash = parseFloat(cashInput.value);
  if (isNaN(cash)) return;
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    cashInput.value = "";
    return;
  } else if (cash === price) {
    output.textContent = "No change due - customer paid with exact cash";
  } else {
    let remainder = cash - price;
    let remainderArr = [];

    cidTotal = parseFloat(cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2));
    if (remainder > cidTotal) {
      output.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
      return;
    }

    for (let i = cidValues.length - 1; i >= 0; i--) {
      let iNeed = Math.floor(remainder / cidValues[i]);
      let iHave = cid[i][1] / cidValues[i];
      let takenCount = Math.min(iNeed, iHave);
      let takenQuantity = parseFloat((takenCount * cidValues[i]).toFixed(2));
      remainder = parseFloat((remainder - takenQuantity).toFixed(2));
      cid[i][1] = parseFloat((cid[i][1] - takenQuantity).toFixed(2));
      cidTotal = parseFloat((cidTotal - takenQuantity).toFixed(2));
      if (takenQuantity !== 0) {
        remainderArr.push([cid[i][0], takenQuantity]);
      }
    }

    output.innerHTML = "";
    if (remainder !== 0) {
      output.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
      let i = 0, j = remainderArr.length - 1;
      while (i < cid.length && j >= 0) {
        if (cid[i][0] === remainderArr[j][0]) {
          cid[i][1] = parseFloat((cid[i][1] + remainderArr[j][1]).toFixed(2));
          cidTotal = parseFloat((cidTotal + remainderArr[j][1]).toFixed(2));
          j--;
        }
        i++;
      }
    } else {
      if (cidTotal === 0) {
        output.innerHTML += `<p>Status: CLOSED</p>`;
      } else {
        output.innerHTML += `<p>Status: OPEN</p>`;
      }
      remainderArr.forEach(item => output.innerHTML += `<p>${item[0]}: $${item[1]}</p>`)
    }

    loadScreen();
  }
}

window.onload = loadScreen;
purchaseBtn.addEventListener("click", handleInput);
cashInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleInput();
  }
});

/* ------------------ */
