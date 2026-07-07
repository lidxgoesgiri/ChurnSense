import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV, splitCsvLine, parseCsvRecords, CsvFormatError } from './csv-parser';

const HEADER = 'project_name,total_users,active_users,churned_users,monthly_revenue';

test('parses a basic CSV', () => {
  const rows = parseCSV(`${HEADER}\nAcme,1000,850,150,5000`);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], {
    projectName: 'Acme',
    totalUsers: 1000,
    activeUsers: 850,
    churnedUsers: 150,
    monthlyRevenue: 5000,
  });
});

test('honors quoted separators', () => {
  assert.deepEqual(splitCsvLine('"Acme, Inc.",1000', ','), ['Acme, Inc.', '1000']);
});

test('handles quoted field containing a newline (#7.6)', () => {
  const csv = `${HEADER}\n"Acme\nInc.",1000,850,150,5000`;
  const rows = parseCSV(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].projectName, 'Acme\nInc.');
  assert.equal(rows[0].totalUsers, 1000);
});

test('preview parser matches quoting rules (#6.2)', () => {
  const records = parseCsvRecords('"a,b",c\nd,e', ',');
  assert.deepEqual(records, [['a,b', 'c'], ['d', 'e']]);
});

test('detects semicolon separator', () => {
  const rows = parseCSV(
    'project_name;total_users;active_users;churned_users;monthly_revenue\nAcme;100;80;20;500'
  );
  assert.equal(rows[0].projectName, 'Acme');
  assert.equal(rows[0].totalUsers, 100);
});

test('throws on a missing required header', () => {
  assert.throws(() => parseCSV('project_name,total_users\nAcme,100'), CsvFormatError);
});

test('strips a UTF-8 BOM', () => {
  const rows = parseCSV(`﻿${HEADER}\nAcme,1,1,0,1`);
  assert.equal(rows[0].projectName, 'Acme');
});
