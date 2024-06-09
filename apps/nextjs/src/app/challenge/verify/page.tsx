export const runtime = "edge";
import {
  ChallengeCardWithForm
} from "./../../_components/ai-verify";
export default function VerifyPage() {

  return (
    <main className="container max-h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          AI Verify
        </h1>
        <ChallengeCardWithForm />
      </div>
    </main>
  );
}
