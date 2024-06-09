import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@sobrxrpl/db";
import { Post, RequestedTransaction, User, Wallet } from "@sobrxrpl/db/schema";
import type { VerifiedOptions } from "@sobrxrpl/db";
import { v4 } from "uuid";

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

			const dbUser = await ctx.db.query.User.findFirst({
				where: eq(User.id, ctx.session.user.id),
			});

			if (!dbUser) {
				throw new Error("User not found");
			}

			if(dbUser.verificationSettings && dbUser.verificationSettings.triggerWhenOver < +amount) {
				const verifiedOptions = {
					methods: dbUser.verificationSettings.methods.map((method) => ({
						...method,
						verified: false,
						id: v4(),
					})),
				} satisfies VerifiedOptions;
				// Request the user complete the verification methods
				const requestedTransactionId = (await ctx.db.insert(RequestedTransaction).values({
					amount,
					destination,
					walletId: id,
					status: "pending",
					verifiedOptions,
				}).returning({ id: RequestedTransaction.id }))?.[0]?.id;

				if(!requestedTransactionId) {
					throw new Error("Failed to create requested transaction");
				}

				return {
					requestedTransactionId,
					verifiedOptions
				};
			
			} else {
				await xrplClient.connect();
				const wallet = new XRPLWallet(dbWallet.publicKey, dbWallet.privateKey);
				await xrplClient.submit({
					Account: wallet.classicAddress,
					Destination: destination,
					Amount: amount,
					TransactionType: "Payment",
				}, {wallet});
				await xrplClient.disconnect();
				return true;
			}
		}),

	verifyOption: protectedProcedure
		.input(z.object({ requestedTransactionId: z.string(), verifiedOptionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const requestedTransaction = await ctx.db.query.RequestedTransaction.findFirst({
				where: eq(RequestedTransaction.id, input.requestedTransactionId),
			});

			if (!requestedTransaction) {
				throw new Error("Requested transaction not found");
			}

			const verifiedOption = requestedTransaction.verifiedOptions.methods.find((method) => method.id === input.verifiedOptionId);

			if (!verifiedOption) {
				throw new Error("Verified option not found");
			}

			const newVerifiedOptions = requestedTransaction.verifiedOptions.methods.map((method) => {
				if (method.id === input.verifiedOptionId) {
					return {
						...method,
						verified: true,
					};
				}
				return method;
			});

			const allVerified = newVerifiedOptions.every((method) => method.verified);

			if(allVerified){
				// get the wallet
				const dbWallet = await ctx.db.query.Wallet.findFirst({
					where: eq(Wallet.id, requestedTransaction.walletId),
				});

				if(!dbWallet) {
					throw new Error("Wallet not found");
				}
				await xrplClient.connect();
				const wallet = new XRPLWallet(dbWallet.fullWallet.publicKey, dbWallet.fullWallet.privateKey);
				await xrplClient.submit({
					Account: wallet.classicAddress,
					Destination: requestedTransaction.destination,
					Amount: requestedTransaction.amount,
					TransactionType: "Payment",
				}, {wallet});
				await xrplClient.disconnect();
				// set the transaction to completed
				await ctx.db.update(RequestedTransaction).set({
					status: "completed",
					verifiedOptions: {
						methods: newVerifiedOptions,
					}
				}).where(eq(RequestedTransaction.id, requestedTransaction.id));
				return true;
			} else {
				await ctx.db.update(RequestedTransaction).set({
					verifiedOptions: {
						methods: newVerifiedOptions,
					},
				}).where(eq(RequestedTransaction.id, requestedTransaction.id));
				return newVerifiedOptions;
			}
		}),

	getAllRequestedTransactions: protectedProcedure
		.query(({ ctx }) => {
			return ctx.db.select().from(RequestedTransaction)
				.where(and(eq(RequestedTransaction.status, "pending"), eq(Wallet.userId, ctx.session.user.id)))
				.innerJoin(Wallet, eq(RequestedTransaction.walletId, Wallet.id))
		}),

	getRequestedTransaction: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return (await ctx.db.select().from(RequestedTransaction)
				.where(eq(RequestedTransaction.id, input.id))
				.innerJoin(Wallet, eq(RequestedTransaction.walletId, Wallet.id)).limit(1))?.[0];
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
