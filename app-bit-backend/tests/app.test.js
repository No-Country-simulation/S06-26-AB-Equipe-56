const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');

test('app exports an express instance', () => {
  assert.ok(app);
  assert.equal(typeof app.listen, 'function');
  assert.equal(typeof app.use, 'function');
});
