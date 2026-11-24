import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {studentReport} from '../src/students.mjs';
import {engines,scenario,resourceName} from '../src/engines.mjs';

const load=async name=>JSON.parse(await readFile(new URL('../data/'+name,import.meta.url)));
test('coursework answer matches fictional fixtures',async()=>{
  const rows=await load('sample.json');
  const original=JSON.stringify(rows);
  assert.deepEqual(studentReport(rows),await load('expected.json'));
  assert.equal(JSON.stringify(rows),original);
});
test('custom grade threshold includes exact boundary',async()=>{
  assert.deepEqual(studentReport(await load('sample.json'),82).students.map(row=>row.id),[3,1]);
  assert.deepEqual(studentReport(await load('sample.json'),100).students,[]);
});
test('bad grades and duplicate IDs fail instead of producing misleading reports',()=>{
  for(const grade of ['',null,true,-1,101,'wrong']) {
    assert.throws(()=>studentReport([{id:1,student:'Example',grade}]));
  }
  assert.throws(()=>studentReport([{id:1,student:'A',grade:80},{id:1,student:'B',grade:90}]));
  assert.throws(()=>studentReport([]));
  assert.throws(()=>studentReport([{id:1,student:'A',grade:80}],NaN));
});
test('engine-specific plans seed students and update a grade only inside owned fixtures',async()=>{
  const meta=JSON.parse(await readFile(new URL('../example.json',import.meta.url)));
  const def=engines.find(engine=>engine.engine===meta.engine);
  assert.equal(def.useCase,'student');
  assert.deepEqual(def.columns.map(([column])=>column),['id','student','grade']);
  const fixture=resourceName(def.slug,'c'.repeat(24));
  const plan=scenario(def,fixture);
  for(const phase of ['seed','read','update','cleanup']) assert.ok(plan.some(step=>step.phase===phase));
  assert.ok(JSON.stringify(plan.find(step=>step.phase==='update')).includes('92'));
  assert.ok(plan.every(step=>JSON.stringify(step).includes(fixture)));
});
