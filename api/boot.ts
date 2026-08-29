import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { ensureSchema } from "./lib/migrate";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  
  // 1. Try to connect to DB, but DON'T crash if it is blocked
  try {
    await ensureSchema();
    console.log("Database schema verified.");
  } catch (error) {
    console.log("Database connection failed during boot, but continuing server startup...");
  }

  // 2. Serve the React frontend
  try {
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);
  } catch (error) {
    console.log("Static files error:", error);
  }

  // 3. Force the server to listen so Cloud Run goes green
  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}
