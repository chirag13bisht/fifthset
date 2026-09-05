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
      
      // 1. Save to Cloud SQL
      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        topic: input.topic || null,
        message: input.message,
      });

      // 2. Trigger Telegram
      try {
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!telegramToken || !chatId) {
          console.error("CRITICAL: Telegram variables are missing from Cloud Run.");
        } else {
          const text = `New Contact: ${input.name}\nEmail: ${input.email}\nTopic: ${input.topic || "None"}\nMessage: ${input.message}`;
          
          const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: text }),
          });

          // This forces Node to log Telegram's exact rejection reason
          if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Telegram API Rejected: ${errorDetails}`);
          } else {
            console.log("Telegram message dispatched successfully!");
          }
        }
      } catch (error) {
        console.error("Messaging automation network crash:", error);
      }

      // 3. Return success to frontend
      return { ok: true as const };
    }),
});