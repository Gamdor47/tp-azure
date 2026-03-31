const http = require('http');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(` ${name}`);
    passed++;
  } catch (e) {
    console.log(` ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function httpGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET'
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log(' Lancement des tests...\n');

  const root = await httpGet('/');
  test('GET / retourne un message', () => {
    assert(root.status === 200, `Status ${root.status}`);
    assert(root.body.message, 'Pas de message');
  });

  const todos = await httpGet('/todos');
  test('GET /todos retourne un tableau', () => {
    assert(todos.status === 200, `Status ${todos.status}`);
    assert(Array.isArray(todos.body), 'Pas un tableau');
  });

  console.log(`\n ${passed} tests passés,  ${failed} tests échoués`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});