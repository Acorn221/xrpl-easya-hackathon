export const runtime = "edge";
import {
  Game,
} from "./../_components/reaction";
export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Reaction Game
        </h1>
        <p>Click on "Start" first, and wait until the
          background color changes. As soon as it changes, hit "Stop!"
        </p>
        <Game/>
      </div>
    </main>
  );
}
