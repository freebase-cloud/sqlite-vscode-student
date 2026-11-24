// Fictional coursework fixtures, never real student information.
export function studentDefinitions(engines) {
  return engines.map(def => ({
    ...def,
    useCase:'student',
    columns:[['id','integer'],['student','text'],['grade','integer']],
    rows:[
      {id:1,student:'Alex Example',grade:82},
      {id:2,student:'Blair Sample',grade:58},
      {id:3,student:'Casey Demo',grade:95},
    ],
    filter:'grade >= 70',
  }));
}

export function studentReport(rows, minimum=70) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('Expected student records');
  if (!Number.isFinite(minimum) || minimum<0 || minimum>100) throw new Error('Minimum grade must be between 0 and 100');
  const ids=new Set();
  const normalized=rows.map(row=>{
    if (!row || !Number.isInteger(Number(row.id)) || Number(row.id)<1 ||
        typeof row.student!=='string' || !row.student.trim() ||
        !['number','string'].includes(typeof row.grade) ||
        (typeof row.grade==='string' && !row.grade.trim()) ||
        !Number.isFinite(Number(row.grade)) || Number(row.grade)<0 || Number(row.grade)>100) {
      throw new Error('Invalid student record');
    }
    const id=Number(row.id);
    if(ids.has(id)) throw new Error('Duplicate student id');
    ids.add(id);
    return {id,student:row.student,grade:Number(row.grade)};
  });
  return {
    minimum,
    students:normalized.filter(row=>row.grade>=minimum).sort((a,b)=>b.grade-a.grade || a.id-b.id),
    needsSupport:normalized.filter(row=>row.grade<minimum).map(row=>row.student),
    averageGrade:Math.round(normalized.reduce((sum,row)=>sum+row.grade,0)/normalized.length*100)/100,
    sampledRecords:normalized.length,
  };
}
