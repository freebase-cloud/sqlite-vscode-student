import {readFile} from 'node:fs/promises';
import {studentReport} from './students.mjs';
import {engines} from './engines.mjs';
import {configuration,Freebase} from './client.mjs';
import {boundedQuery,dataRecords} from './read.mjs';

async function main() {
  const meta=JSON.parse(await readFile(new URL('../example.json',import.meta.url)));
  const def=engines.find(engine=>engine.engine===meta.engine);
  const index=process.argv.indexOf('--minimum');
  const minimum=index<0 ? 70 : Number(process.argv[index+1]);
  let rows;
  if(process.argv.includes('--live')) {
    rows=dataRecords(def,await new Freebase(configuration(process.env,def.engine))
      .query(boundedQuery(def,process.env.FREEBASE_TABLE)));
  } else {
    rows=JSON.parse(await readFile(new URL('../data/sample.json',import.meta.url)));
  }
  console.log(JSON.stringify(studentReport(rows,minimum),null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
