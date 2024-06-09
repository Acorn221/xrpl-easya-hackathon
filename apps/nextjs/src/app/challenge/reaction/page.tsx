export const runtime = "edge";
import styles from './styles.module.css'
import {
  Game,
} from "../../_components/reaction";
export default function HomePage() {
  const difficulty=10
  return (
    <main className="container max-h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Reaction Game
        </h1>
        <p>Click on "Start" first, and wait until the
          color of the white dot that changes color. As soon as it changes, hit click any where on the screen.
        </p>
        <div className="relative w-full h-screen flex flex-grow">
          <Game/>
          <div>
            {[...Array(difficulty)].map((e, i) => <div className={styles.mblock}></div>)}
          </div>
        </div>
          <div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
      </div>
    </main>
  );
}
