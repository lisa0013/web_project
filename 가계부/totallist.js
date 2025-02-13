// 총합 계산/
function totalsum() {
  let str = "";
  let sumin = 0;
  let sumout = 0;


  for (let i = 0; i < total.length; i++) {
    if (total[i].divide === "1") {

      sumin += parseInt(total[i].amount);

    }else if(total[i].divide === "0") {

      sumout += parseInt(total[i].amount);
    }
  }
  
  document.querySelector('#totalIncome').innerText = sumin;
  document.querySelector('#totalExpense').innerText = sumout;
  document.querySelector('#balance').innerText = sumin - sumout;
}


  
