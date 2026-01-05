import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "2319",
  database: "postgres",
});

export default pool;
