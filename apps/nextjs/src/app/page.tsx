import { Suspense } from "react";

import logo from "~/../public/xrpl-logo2.png";
import { api } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";
import { WalletManager } from "./_components/wallet";

// export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return <WalletManager />;
}
