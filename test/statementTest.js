const test = require('ava');
const {statement} = require('../src/statement');

test('Sample test', t => {
  t.true(true);
  t.is(1, 1);
  t.deepEqual({a: 1}, {a: 1});
});

test('Amount should be $0.00 when the performance is empty', t=>{
  //given
  const invoce = {
    'customer': 'Lester',
    'performances': []
  };

  const result = statement(invoce, plays);

  t.is(result, 'Statement for '+invoce.customer+'\n' +
    'Amount owed is $0.00\n' +
    'You earned 0 credits \n');
})

const invoice = {
  'customer': 'BigCo',
  'performances': [
    {
      'playID': 'hamlet',
      'audience': 55,
    },
    {
      'playID': 'as-like',
      'audience': 35,
    },
    {
      'playID': 'othello',
      'audience': 40,
    },
  ],
};


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};