import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { walletRouter } from "./router/wallet";
import { verifyRouter } from "./router/verify";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  wallet: walletRouter,
  verify: verifyRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
