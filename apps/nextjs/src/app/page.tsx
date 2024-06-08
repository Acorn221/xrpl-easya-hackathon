import { Suspense } from "react";

import logo from "~/../public/xrpl-logo2.png";
import { api } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  const posts = api.post.all();

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex justify-center gap-4 align-middle">
          <img
            src={logo.src}
            alt="XRPL Logo"
            className="m-auto h-32 w-32 rounded-full"
          />
          <h1 className="m-auto flex-1 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Sobr XRPL
          </h1>
        </div>
        <AuthShowcase />

        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
