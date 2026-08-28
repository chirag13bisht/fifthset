import { z } from "zod";
import { count, eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { rsvps } from "@db/schema";
import { EVENTS } from "@contracts/events";

function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}

export const eventsRouter = createRouter({
  stats: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db
      .select({ eventSlug: rsvps.eventSlug, status: rsvps.status, total: count() })
      .from(rsvps)
      .groupBy(rsvps.eventSlug, rsvps.status);

    return EVENTS.map((event) => {
      const confirmed =
        rows.find((r) => r.eventSlug === event.slug && r.status === "confirmed")?.total ?? 0;
      const waitlist =
        rows.find((r) => r.eventSlug === event.slug && r.status === "waitlist")?.total ?? 0;
      const remaining =
        event.capacity === null ? null : Math.max(event.capacity - confirmed, 0);
      return {
        slug: event.slug,
        name: event.name,
        capacity: event.capacity,
        confirmed,
        waitlist,
        remaining,
        interestOnly: event.interestOnly,
      };
    });
  }),

  rsvp: publicQuery
    .input(
      z.object({
        eventSlug: z.string().min(1),
        name: z.string().trim().min(2, "Please tell us your name").max(120),
        email: z.string().trim().email("A valid email helps us reach you").max(255),
        whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
        level: z.string().trim().max(40).optional().or(z.literal("")),
        message: z.string().trim().max(1000).optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const event = getEvent(input.eventSlug);
      if (!event) {
        throw new Error("Unknown event.");
      }

      const db = getDb();

      // Prevent duplicate submissions for the same event + email
      const existing = await db
        .select({ id: rsvps.id, status: rsvps.status })
        .from(rsvps)
        .where(and(eq(rsvps.eventSlug, event.slug), eq(rsvps.email, input.email)))
        .limit(1);
      if (existing.length > 0) {
        return {
          status: existing[0].status,
          duplicate: true,
          eventName: event.name,
          waitlistPosition: null as number | null,
        };
      }

      let status: "confirmed" | "waitlist" | "interest";
      if (event.interestOnly) {
        status = "interest";
      } else if (event.capacity === null) {
        status = "waitlist";
      } else {
        const [{ total }] = await db
          .select({ total: count() })
          .from(rsvps)
          .where(and(eq(rsvps.eventSlug, event.slug), eq(rsvps.status, "confirmed")));
        status = total < event.capacity ? "confirmed" : "waitlist";
      }

      await db.insert(rsvps).values({
        eventSlug: event.slug,
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp || null,
        level: input.level || null,
        message: input.message || null,
        status,
      });

      let waitlistPosition: number | null = null;
      if (status === "waitlist") {
        const [{ total }] = await db
          .select({ total: count() })
          .from(rsvps)
          .where(and(eq(rsvps.eventSlug, event.slug), eq(rsvps.status, "waitlist")));
        waitlistPosition = total;
      }

      return { status, duplicate: false, eventName: event.name, waitlistPosition };
    }),
});
