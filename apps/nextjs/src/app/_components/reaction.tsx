"use client";
// import { Suspense } from "react";
// import { api } from "~/trpc/server";
// import { AuthShowcase } from "./../_components/auth-showcase";
// import {
//   CreatePostForm,
//   PostCardSkeleton,
//   PostList,
// } from "./../_components/posts";
// import { Button } from "@acme/ui/button";
// export const runtime = "edge";
//
// export default function HomePage() {
//   // You can await this here if you don't want to show Suspense fallback below
//   const posts = api.post.all();

//
//   return (
//     <main className="container h-screen py-16">
//       <div className="flex flex-col items-center justify-center gap-4">
//         <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//           Reaction Game
//         </h1>
//         <p>Click on "Start" first, and wait until the
//           background color changes. As soon as it changes, hit "Stop!"
//         </p>
//         <div className="flex flex-row gap-4 ">
//
//             <Button>Start</Button>
//           <button onClick={handleClick}>Like</button>
//
//           <Button>Stop</Button>
//         </div>
//
//         <div className="w-screen bg-yellow-300 h-screen">
//
//         </div>
//
//
//       </div>
//     </main>
//   );
// }


import {cn} from "@acme/ui";
import { Button } from "@acme/ui/button";
import React from "react";

export function Game() {
  const pulse=true;
    const [started, setStarted] = React.useState(false);
    const [color, setColor] = React.useState("fff")
    const [colorGeneratedAt, setColorGeneratedAt] = React.useState(0)
    const [reactionTime, setReactionTime] = React.useState(0)
    const generateColor = () => {
        setColor(Math.random().toString(16).substr(-6));
        setColorGeneratedAt(Date.now())
    };
    function handleStart() {
        setStarted(true)
        setTimeout(() => {
            generateColor()
        }, Math.floor(Math.random() * 5000));
    }
    function handleStop() {
        setStarted(false)
       setReactionTime((Date.now()-colorGeneratedAt)/1000)
    }
  return (
      <div className="flex flex-row rounded-lg bg-muted p-4">
        <div className="flex-grow">
                    <div className="flex flex-row gap-4 ">

                        {!started && <Button onClick={handleStart}>Start</Button>}
                        {started &&  <Button onClick={handleStop} >Stop</Button>}

                    </div>
            <div className="flex flex-grow h-52 rounded-lg  p-1 m-1" style={{ backgroundColor: `#${color}` }}>

            </div>
            <p>Reaction time:{reactionTime}</p>
        </div>
      </div>
  );
}
