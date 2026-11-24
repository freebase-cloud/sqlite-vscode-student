# sqlite-vscode-student

sqlite student coursework: fictional records, grade filtering, CRUD and tested exercise answers in VS Code.

**Engine:** `sqlite`. **Compatibility limit:** Hosted SQL compatibility, not a local SQLite file. No filesystem access, PRAGMA administration, or SQLite extension loading.

## Connect from VS Code

1. Install [Freebase](https://marketplace.visualstudio.com/items?itemName=freebasecloud.freebase-vscode)
   (`code --install-extension freebasecloud.freebase-vscode`).
   See [the install guide](https://freebase.cloud/vscode).
2. Open this folder in a trusted VS Code workspace. Run **Freebase: Sign In** and
   approve the editor connection in your browser. This is separate from a project API key.
3. Choose an existing database. **Freebase: Import Existing Databases** requires
   website sign-in plus a same-account API key; it doesn't copy data.
   **Freebase: Create Database** is optional. The free tier allows one owned instance
   per engine; additional same-engine instances require Pro through the website.
   Sharing remains free.
4. Run **Freebase: Configure Project**, selecting the same instance. It asks before
   writing a working key to your local `.env`. Alternatively copy `.env.example`
   to `.env` and fill it locally. Never paste credentials into chat.
5. Use **Freebase: Run Query**, **Freebase: Open Database**, or **Freebase: Ask Your Data**.
   Check the selected instance and role; shared read-only access cannot write.

Database HTTP API calls include `X-Database-Instance`; MCP uses its token's named connection.
The API key, VS Code browser approval,
and MCP token are different credentials. Connecting all clients to the same instance
shows the same authorized data, never public account-wide data.


## Student coursework

`npm start` filters fictional grades, identifies students needing support, and
calculates the sampled average without credentials or network access.
`npm start -- --minimum 90` changes the threshold.
`npm test` checks the expected answers, invalid inputs, transport and CRUD plans.
See [EXERCISES.md](EXERCISES.md) for tasks, answers, engine-specific behavior and safe live setup.
The grade filtering and statistics run in JavaScript, not a claimed universal native query.
`npm run report:live` is a bounded, read-only report on `FREEBASE_TABLE`.

## Run the engine starter

```sh
npm run preview               # safe query-plan preview; no credentials
npm test                      # offline tests; no network
npm run demo -- --apply        # uses .env, creates randomized fixtures, cleans up
```

The demo prints seed/read/update/verify results, then removes only its randomized
`fbx_` fixture. It never drops a user-named table. On partial failure it attempts
that same bounded cleanup once and reports an unconfirmed cleanup.
Neo4j cleanup drops only its randomized label's backing fixture table.
InfluxDB and Prometheus demos use structured Freebase writes rather than claiming
a native ingestion endpoint. Redis stores the sample records in one JSON string.

## Sample schema and data

Columns: `id` (integer), `student` (text), `grade` (integer).

```json
[
  {
    "id": 1,
    "student": "Alex Example",
    "grade": 82
  },
  {
    "id": 2,
    "student": "Blair Sample",
    "grade": 58
  },
  {
    "id": 3,
    "student": "Casey Demo",
    "grade": 95
  }
]
```

## Engine-specific request example

The full create/read/update/cleanup plan is in `queries/preview.json`.
These native-style strings go in `query` with `protocol: "sqlite"`
at `POST /api/wire/query`; they are not requests to a native engine endpoint.
Structured seed operations instead use `POST /api/wire/dispatch`.

```text
SELECT * FROM fbx_sqlite_000000000000000000000000 LIMIT 100
```

## Safety and compatibility

- Node.js **22+**; no npm dependencies or install step. All tests run offline.
- These are clients of **Freebase compatibility layers**, not full native database servers,
  separate extensions, or replacement official MCP servers.
- HTTPS is required except explicit loopback HTTP for local API tests. Redirects are
  rejected, requests time out, and writes are **never retried**.
- Default commands preview queries or use synthetic sample files. Live requests need
  your local credentials and explicit flags. Live writes additionally require `--apply`.
- Query translation may use an LLM and is not deterministic (CQL has a dedicated parser).
  A passing offline test does **not** prove a hosted engine or native desktop client works.
- Do not use production data for demos. Data printed to the terminal or exported may
  be sensitive. Use a disposable owned instance or an explicitly permitted test table.
- No transaction, rollback, full-dataset export, native performance, or full SQL/CQL/
  BSON/PromQL compatibility is promised. Reads are bounded and may be incomplete.
- Desktop tools use the website's secure local connectors where provided, not direct
  public native TCP. These HTTPS examples do not need a desktop tunnel.
- Do not commit `.env`, tokens, exports, or logs. No scripts publish to GitHub.
- Offline tests verify transport, safety, plans, and local application logic with mock
  responses. See the collection validation report for exactly what was run.

## Troubleshooting

401: check the credential type and whether it was revoked. 403: check the selected
instance and sharing role. 429: stop and wait; do not retry writes automatically.
An HTTP 200 with an operation error is still a failure. A timeout can follow a
successful write: inspect the named fixture instead of blindly rerunning it.

This example code is MIT licensed. It grants no license to database trademarks,
Freebase's hosted service, or third-party extensions.
