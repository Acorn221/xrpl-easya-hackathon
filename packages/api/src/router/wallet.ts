import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@sobrxrpl/db";
import { CreatePostSchema, Post, User, Wallet } from "@sobrxrpl/db/schema";

import { protectedProcedure } from "../trpc";
import xrpl from "xrpl";

const xrplClient = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

const defaultWalletFunds = 420;

export const walletRouter = {
  getAll: protectedProcedure
    .query(({ ctx }) => {

      return ctx.db.select().from(Wallet).where(eq(User.id, ctx.session.user.id));
    }),
	
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.db.query.Wallet.findFirst({
				where: eq(Wallet.id, input.id),
			});
		}),

  create: protectedProcedure
		.input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
			// create a wallet on the xrpl
			await xrplClient.connect();

			const wallet = xrpl.Wallet.generate();

			await xrplClient.fundWallet(wallet, {
				amount: `${defaultWalletFunds}`,
			});

			await xrplClient.disconnect();

      return ctx.db.insert(Wallet).values({
				fullWallet: wallet,
				name: input.name,
				privateKey: wallet.privateKey,
				publicKey: wallet.publicKey,
				userId: ctx.session.user.id,
				lastBalance: defaultWalletFunds,
			});
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Post).where(eq(Post.id, input));
  }),
} satisfies TRPCRouterRecord;
