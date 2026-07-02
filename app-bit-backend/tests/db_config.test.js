const test = require('node:test');
const assert = require('node:assert/strict');
require("dotenv").config();
const { getDbConfig, createSqlClient } = require('../src/config/db_config');



test('createSqlClient builds a client for a Neon database URL', () => {
  process.env.DATABASE_URL = 'postgres://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require';

  const client = createSqlClient();

  assert.equal(typeof client, 'function');
});

test('createSqlClient throws a clear error when DATABASE_URL is missing', () => {
  delete process.env.DATABASE_URL;

  assert.throws(() => createSqlClient(), /DATABASE_URL is not configured/);
});
