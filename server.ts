import { Database } from "bun:sqlite";
import { serve, file } from "bun";
import index from "./index.html";
import misaProfiles from "./misa-profiles.json";

import { loadData } from "./data";
const data = await loadData();

const misaOrdenados = misaProfiles.sort(
  (a, b) => b.followersCount - a.followersCount
);

// Crear y configurar la base de datos SQLite
const db = new Database(process.env.DB_PATH || "consultas.sqlite");
db.run(`
  CREATE TABLE IF NOT EXISTS consultas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

// Iniciar el servidor
const server = serve({
  port: 3000,
  idleTimeout: 255,

  routes: {
    "/": index,
    "/static/card.jpg": (req) => new Response(file("static/card.jpg")),
    "/api/verificar": async (req) => {
      const url = new URL(req.url);
      const username = url.searchParams.get("username");

      if (!username) {
        return new Response(
          JSON.stringify({ error: "Nombre de usuario requerido" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const listas = data.filter((l) =>
        l.content.some((u) =>
          u.result.legacy.screen_name
            .toLowerCase()
            .includes(username.toLowerCase())
        )
      );

      // Guardar la consulta en la base de datos
      db.run("INSERT INTO consultas (username, timestamp) VALUES (?, ?)", [
        username.toLowerCase(),
        Date.now(),
      ]);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      return new Response(
        JSON.stringify({ listasNames: listas.map((l) => l.name) }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
    "/api/top-usuarios": (req) => {
      return new Response(JSON.stringify(misaOrdenados.slice(0, 100)), {
        headers: { "Content-Type": "application/json" },
      });
    },
  },
});

console.log(`Servidor corriendo en http://localhost:${server.port}`);
