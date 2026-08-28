import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactMessages } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().trim().min(2, "Please tell us your name").max(120),
        email: z.string().trim().email("A valid email helps us reply").max(255),
        topic: z.string().trim().max(64).optional().or(z.literal("")),
        message: z.string().trim().min(10, "A few more words, please").max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        topic: input.topic || null,
        message: input.message,
      });
      return { ok: true as const };
    }),
});
