function statement (invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  const USD = formatToUSD();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    result += ` ${play.name}: ${USD(thisAmount / 100)} (${perf.audience} seats)\n`;
    // totalAmount += thisAmount;
  }
  const receipt = generateReceipt(invoice, plays);
  const totalAmount = caculateTotalAmount(receipt)
  const volumeCredits = volumeCreditsFor(invoice, plays);
  result += `Amount owed is ${USD(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
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

function formatToUSD() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
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
};