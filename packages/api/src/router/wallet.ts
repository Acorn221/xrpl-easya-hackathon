import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@sobrxrpl/db";
import { Post, User, Wallet } from "@sobrxrpl/db/schema";

import { protectedProcedure } from "../trpc";
import { Client, Wallet as XRPLWallet } from "xrpl";

const xrplClient = new Client("wss://s.altnet.rippletest.net:51233");

const defaultWalletFunds = 420;

export const walletRouter = {
  getAll: protectedProcedure
    .query(({ ctx }) => {

      return ctx.db.select().from(Wallet).where(eq(Wallet.userId, ctx.session.user.id));
    }),
	
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.db.query.Wallet.findFirst({
				where: eq(Wallet.id, input.id),
			});
		}),

	getBalance: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const wallet = await ctx.db.query.Wallet.findFirst({
				where: and(eq(Wallet.id, input.id), eq(Wallet.userId, ctx.session.user.id)),
			});

			if (!wallet) {
				throw new Error("Wallet not found");
			}
			await xrplClient.connect();
			const balances = await xrplClient.getXrpBalance(wallet.fullWallet.classicAddress);
			await xrplClient.disconnect();

			return balances;
		}),
		
	makeTransaction: protectedProcedure
		.input(z.object({ id: z.string(), amount: z.string(), destination: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { id, amount, destination } = input;
			const dbWallet =
				await ctx.db.query.Wallet.findFirst({
					where: and(eq(Wallet.id, id), eq(Wallet.userId, ctx.session.user.id)),
				});
			
			if(!dbWallet) {
				throw new Error("Wallet not found");
			}
			
			await xrplClient.connect();
			const wallet = new XRPLWallet(dbWallet.publicKey, dbWallet.privateKey);

			await xrplClient.submit({
				Account: wallet.classicAddress,
				Destination: destination,
				Amount: amount,
				TransactionType: "Payment",
			}, {wallet});
		}),

  create: protectedProcedure
		.input(z.object({ name: z.string().min(3).max(20) }))
    .mutation(async ({ ctx, input }) => {
			// create a wallet on the xrpl
			await xrplClient.connect();

			const wallet = XRPLWallet.generate();

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
