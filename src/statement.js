function statement (invoice, plays) {
  return generateTxt(invoice, plays);
}

function generateTxt(invoice, plays) {
  const receipt = generateReceipt(invoice, plays);
  const totalAmount = caculateTotalAmount(receipt)
  const volumeCredits = volumeCreditsFor(invoice, plays);
  return generateResult(invoice, receipt, totalAmount, volumeCredits);
}

function renderPage(invoice, plays) {
  const receipt = generateReceipt(invoice, plays)
  const totalAmount = caculateTotalAmount(receipt) 
  const volumeCredits = volumeCreditsFor(invoice, plays);
  let page = `<h1>Statement for ${invoice.customer}</h1>\n`
  page += generateTable(receipt)
  page += `<p>Amount owed is <em>${USD(totalAmount)}</em></p>\n`;
  page += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
  return page
}

function generateTable(receipt) {
  let table = '<table>\n'
  +'<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for(let res of receipt) {
    table += ` <tr><td>${res.name}</td><td>${res.audience}</td><td>${USD(res.amount)}</td></tr>\n`;
  }
  return table + "</table>\n"
}

function generateResult(invoice, receipt, totalAmount, volumeCredits) {
  let result = `Statement for ${invoice.customer}\n`;
  for(let res of receipt) {
    result += ` ${res.name}: ${USD(res.amount)} (${res.audience} seats)\n`;
  }
  result += `Amount owed is ${USD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result
}

function generateReceipt(invoice, plays) {
  let receipt = [];
  for (let perf of invoice.performances) {
      const play = plays[perf.playID];
      receipt.push({name: play.name, audience: perf.audience, amount: calculateAmount(perf, play)});
  }
  return receipt;
}

function calculateAmount(perf, play) {
  let amount = 0;
  if(play.type !== 'tragedy' && play.type !== 'comedy'){
    throw new Error(`unknown type: ${play.type}`);
  }
  if(play.type == 'tragedy'){
    amount = 40000;
    if (perf.audience > 30) {
      amount += 1000 * (perf.audience - 30);
    }
  }
  else if(play.type == 'comedy'){
    amount = 30000;
    if (perf.audience > 20) {
      amount += 10000 + 500 * (perf.audience - 20);
    }
    amount += 300 * perf.audience;
  }
  return amount
}

function caculateTotalAmount(receipt) {
  let totalAmount = 0;
  for(let res of receipt) {
    totalAmount += res.amount
  }
  return totalAmount
}

function USD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value / 100);
}

function volumeCreditsFor(invoice, plays) {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === plays[perf.playID].type)
      volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

module.exports = {
  statement,
  renderPage,
};