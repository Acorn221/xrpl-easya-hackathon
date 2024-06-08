"use client";
import { Button } from "@acme/ui/button";
import React, {useEffect} from "react";

export function Game() {
    const [started, setStarted] = React.useState(false);
    const [color, setColor] = React.useState("fff")
    const [colorGeneratedAt, setColorGeneratedAt] = React.useState(0)
    const [reactionTime, setReactionTime] = React.useState(0)
    const generateColor = () => {
        console.log("")
        setColor(Math.random().toString(16).substr(-6));
        setColorGeneratedAt(Date.now())
    };
    useEffect(() => {
        document.body.addEventListener('click', handleStop);
        return () => {
            document.body.removeEventListener('click', handleStop);
        }
    }, [started]);
    function handleStart() {
        setStarted(true)
        setTimeout(() => {
            generateColor()
        }, Math.floor(Math.random() * 5000));
    }
    function handleStop() {
        if(started){
            console.log("stopped")
            setStarted(false)
            setReactionTime((Date.now()-colorGeneratedAt)/1000)
            setColor("fff")
        }

    }
  return (
      <div className="flex flex-row rounded-lg  p-4">
        <div className="flex-grow">
                    <div className="flex flex-row gap-4 ">

                        {!started && <Button onClick={handleStart}>Start</Button>}

                    </div>
            <div className="flex flex-grow h-52 rounded-lg  p-1 m-1" style={{ backgroundColor: `#${color}` }}>
            </div>
            <p>Reaction time:{reactionTime}</p>
        </div>
      </div>
  );
}
