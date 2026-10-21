import "dotenv/config";
import app from "./app.js";
import { pool } from "./config/db.js";

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () => {
      console.log(`Pumachefcitos API disponible en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No fue posible conectar con PostgreSQL.", error);
    process.exit(1);
  }
}

start();
