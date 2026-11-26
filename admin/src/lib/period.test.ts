import assert from 'node:assert/strict';
import { test } from 'node:test';

import { aggregate, bucketOf, localDate, presetPeriod, previousPeriod, validCustom } from './period.ts';

test('fecha local de Buenos Aires (UTC−3) en el borde del día', () => {
  // 02:30 UTC del 27 = 23:30 del 26 en Buenos Aires.
  assert.equal(localDate(new Date('2026-11-27T02:30:00Z')), '2026-11-26');
  assert.equal(localDate(new Date('2026-11-27T03:00:00Z')), '2026-11-27');
});

test('presets inclusive y período anterior de igual largo', () => {
  const t = '2026-11-26';
  assert.deepEqual(presetPeriod('today', t), { preset: 'today', from: t, to: t });
  assert.deepEqual(presetPeriod('yesterday', t), { preset: 'yesterday', from: '2026-11-25', to: '2026-11-25' });
  assert.deepEqual(presetPeriod('7d', t), { preset: '7d', from: '2026-11-20', to: t });
  assert.equal(presetPeriod('12m', t).from, '2025-11-27');
  assert.deepEqual(previousPeriod({ from: '2026-11-20', to: '2026-11-26' }), { from: '2026-11-13', to: '2026-11-19' });
});

test('período personalizado: igual que admin.check_range', () => {
  assert.equal(validCustom('2026-01-01', '2026-01-01'), true);
  assert.equal(validCustom('2026-02-01', '2026-01-01'), false);
  assert.equal(validCustom('2020-01-01', '2026-01-01'), false);
  assert.equal(validCustom('2026-1-1', '2026-01-02'), false);
});

test('agrupar: semana desde el lunes, suma vs promedio', () => {
  assert.equal(bucketOf('2026-11-26', 'week'), '2026-11-23'); // jueves → lunes 23
  assert.equal(bucketOf('2026-11-23', 'week'), '2026-11-23');
  assert.equal(bucketOf('2026-11-26', 'month'), '2026-11');
  const rows = [
    { day: '2026-11-23', signups: 2, active: 4 },
    { day: '2026-11-24', signups: 1, active: 2 },
    { day: '2026-11-30', signups: 5, active: 1 },
  ];
  assert.deepEqual(aggregate(rows, 'week', { signups: 'sum', active: 'avg' }), [
    { day: '2026-11-23', signups: 3, active: 3 },
    { day: '2026-11-30', signups: 5, active: 1 },
  ]);
});
