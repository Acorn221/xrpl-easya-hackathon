import type xrpl from "xrpl";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { VerificationSettings, VerifiedOptions } from "./types";

export const Post = pgTable("post", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  profile: varchar("profile", { length: 255 }).default("What are your views on politics? I hate all politicians."),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
  verificationSettings: json("verificationSettings").$type<VerificationSettings>().default({
    triggerWhenOver: 10,
    methods: [
      {
        name: "ReactionTest",
      },
      {
        name: "PupilDialationTest",
      },
      {
        name: "GPTInterrogation",
        beliefs: [],
      },
      {
        name: "RubiksCubeTimeTest",
        secondsToBeat: 60,
      }
    ],
  }),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

export const Wallet = pgTable("wallet", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  lastBalance: integer("lastBalance").notNull().default(0),
  privateKey: text("privateKey").notNull(),
  publicKey: text("publicKey").notNull(),
  fullWallet: json("fullWallet").$type<xrpl.Wallet>().notNull(),
});

export const Profile = pgTable("profile", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, {
      onDelete: "cascade",
    }),
  profile: varchar("name", { length: 255 }),
});

export const WalletRelations = relations(Wallet, ({ one }) => ({
  user: one(User, { fields: [Wallet.userId], references: [User.id] }),
}));

export const RequestedTransaction = pgTable("requested_transaction", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  walletId: uuid("walletId")
    .notNull()
    .references(() => Wallet.id, {
      onDelete: "cascade",
    }),
  amount: text("amount").notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  status: varchar("status", {
    length: 255,
    enum: ["pending", "completed"],
  }).notNull(),
  verifiedOptions: json("verifiedOptions").$type<VerifiedOptions>().notNull(),
});
