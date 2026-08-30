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
      
      // 1. Save to Cloud SQL first
      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        topic: input.topic || null,
        message: input.message,
      });

      // 2. Trigger messaging automations safely
      try {
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        // Fire Telegram notification (or WhatsApp webhook)
        if (telegramToken && chatId) {
          const text = `New Contact: ${input.name}\nEmail: ${input.email}\nTopic: ${input.topic || "None"}\nMessage: ${input.message}`;
          
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: text }),
          });
        }
      } catch (error) {
        // Log the external API error internally, but DO NOT use 'throw error'
        console.error("Messaging automation failed:", error);
      }

      // 3. Always return success to the Vite frontend
      return { ok: true as const };
    }),
});