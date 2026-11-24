# Student database coursework

All names and grades are fictional. Use only a disposable fixture, never real student data.

1. **Read:** inspect the three records in `data/sample.json`. Expected IDs: 1, 2, 3.
2. **Filter:** run `npm start`. Grades at least 70 return Casey (95), then Alex (82); Blair (58) needs support.
3. **Change the threshold:** run `npm start -- --minimum 90`. Only Casey qualifies. Average over all three sampled grades stays 78.33.
4. **Create and update:** inspect `npm run preview`, then use `npm run demo -- --apply` only after configuring your test instance.
   It seeds the fictional records and changes Alex's grade from 82 to 92, reads back the change, then cleans up.
5. **Delete:** The plan deletes student ID 2, then removes its randomized fixture. No existing user table or collection is deleted.
6. **Live read:** set `FREEBASE_TABLE` to an existing authorized compatible resource, then `npm run report:live`.
   Expected results match the offline answer only if that resource contains exactly these three unchanged rows.

## Where filtering happens

The grade filter, sort, average and support list run in JavaScript after a bounded
engine-specific read. This deliberately avoids pretending every engine supports
SQL WHERE, joins, or aggregation. SQL/CQL table plans, MongoDB documents, DynamoDB
items, Elasticsearch documents and Cypher nodes use their respective request forms.
Redis stores one JSON array. InfluxDB/Prometheus seed, update and delete through
the Freebase structured API, not native ingestion or administration endpoints.
Student names are labels for stored grade samples on those metric-oriented engines.
This is not a relational course-enrollment model or a native distributed database.

## Safety

No live writes occur on startup. `--apply` explicitly authorizes the temporary demo.
Fixture names use cryptographic random suffixes. Writes are not retried; cleanup
targets only that generated fixture and reports failures. The demo normally deletes
its fixtures, so use the read/update output while running to inspect the lifecycle.
Live reports fetch at most 100 rows (Redis: a single JSON-array key) and summarize
only that sample, never guaranteed whole-class totals.
