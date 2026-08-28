import { createRouter, publicQuery } from "./middleware";
import { eventsRouter } from "./eventsRouter";
import { contactRouter } from "./contactRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  events: eventsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
