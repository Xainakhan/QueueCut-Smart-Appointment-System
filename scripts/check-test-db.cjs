const fs = require("fs");
const { Pool } = require("pg");
const line = fs.readFileSync(".env.test", "utf8").split(/\r?\n/).find((entry) => entry.startsWith("DATABASE_URL_TEST="));
const pool = new Pool({ connectionString: line.slice(line.indexOf("=") + 1), max: 5 });
(async () => {
  const terminated = await pool.query("SELECT pg_terminate_backend(pid) AS terminated FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()");
  console.log("terminated stale sessions:", terminated.rows);
  const activity = await pool.query("SELECT a.pid,a.state,a.wait_event_type,a.wait_event,left(a.query,160) AS query FROM pg_stat_activity a WHERE a.datname=current_database() ORDER BY a.pid");
  console.log("activity:", activity.rows);
  const locks = await pool.query("SELECT l.pid,l.mode,l.granted,c.relname AS relation FROM pg_locks l LEFT JOIN pg_class c ON c.oid=l.relation WHERE l.pid=pg_backend_pid() OR NOT l.granted ORDER BY l.pid");
  console.log("locks:", locks.rows);
  await pool.end();
})().catch(async (error) => { console.error(error.message); await pool.end(); process.exitCode = 1; });
