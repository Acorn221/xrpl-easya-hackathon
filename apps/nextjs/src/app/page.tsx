import { Suspense } from "react";

import { auth } from "@sobrxrpl/auth";

import logo from "~/../public/xrpl-logo2.png";
import { api } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";
import { RequestedTransactionsIndicator } from "./_components/requested-transactions";
import { WalletManager } from "./_components/wallet";

// export const runtime = "edge";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <>
      <WalletManager />
      <RequestedTransactionsIndicator />
    </>
  );
}
