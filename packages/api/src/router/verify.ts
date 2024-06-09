import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure,publicProcedure } from "../trpc";
import OpenAI from 'openai';
import { env } from "../../../../apps/nextjs/src/env"
const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});


export const verifyRouter = {
    getSecurityMsg: publicProcedure
        .input(z.object({
            profile: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { profile } = input;
            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `"${profile}".Based on this statement ask a security question.` }],
                model: 'gpt-3.5-turbo',
            });
            return chatCompletion?.choices[0]?.message?.content;
        }),


    submitAnswer: publicProcedure
        .input(z.object({
            answer: z.string(),
            messages: z.array(
                z.object({
                    role: z.enum(["user", "assistant"]),
                    content: z.string(),
                })
            )
        }))
        .mutation(async () => {
            // const { answer,messages } = input;
            // const chatCompletion = await openai.chat.completions.create({
            //     messages: [
            //         { role: 'user', content: `"${answer}".Is this correct yes or no?` },...messages],
            //     model: 'gpt-3.5-turbo',
            // });

            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `"My favourite author is Malorie Blackman and my favourite book is Boys don't cry from Malorie Blackman. My hobbies include dodgeball, karate and climbing which I try to do on a weekly basis. I study computer science which I enjoy." Based on this statement ask a security question.` },
                    { role: 'assistant', content: `What is the title of your favorite book by Malorie Blackman?` },
                    { role: 'user', content: `Boys don't cry. Is this correct yes or no?` }
                ],
                model: 'gpt-3.5-turbo',
            });

            const msg = chatCompletion?.choices[0]?.message.content;
            if(!msg) throw new Error("No message from GPT");
            return msg.includes("Yes");;
        }),



} satisfies TRPCRouterRecord;