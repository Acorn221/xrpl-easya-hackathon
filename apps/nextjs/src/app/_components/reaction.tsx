"use client";
import { Button } from "@sobrxrpl/ui/button";
import React, {useEffect} from "react";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@sobrxrpl/ui/drawer"



export function Game() {
    const [started, setStarted] = React.useState(false);
    const [color, setColor] = React.useState("fff")
    const [colorGeneratedAt, setColorGeneratedAt] = React.useState(0)
    const [reactionTime, setReactionTime] = React.useState(0)
    const [reactionRemark, setReactionRemark] = React.useState("")
    const generateColor = () => {
        setColor(Math.random().toString(16).substr(-6));
        setColorGeneratedAt(Date.now())
    };
    const [isOpen, setIsOpen] = React.useState(false);
    useEffect(() => {
        window.addEventListener("click", handleStop)
        return () => {
            window.removeEventListener("click", handleStop)
        }
    }, [colorGeneratedAt])
    function handleStart() {
        setStarted(true)
        setTimeout(() => {
            generateColor()
        }, Math.floor(Math.random() * 5000));
    }
    function handleStop() {
        if(colorGeneratedAt>0){
            let normedReactionTime=(Date.now()-colorGeneratedAt)/1000
            setStarted(false)
            setReactionTime(normedReactionTime)
            setColorGeneratedAt(0)
            setColor("fff")
            setIsOpen(true)
            if (normedReactionTime < 0.2)
                setReactionRemark("Well done! You are super sharp!")
            if (normedReactionTime >=0.2 && normedReactionTime < 0.6)
                setReactionRemark("Nice!")
            if (normedReactionTime >=0.6 && normedReactionTime < 1)
                setReactionRemark("Are you sober?")
            if (normedReactionTime >=1)
                setReactionRemark("Did you fall asleep?")
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
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Your Reaction Time </DrawerTitle>
                        <DrawerDescription>Reaction time: {reactionTime} seconds</DrawerDescription>
                        <DrawerDescription>{reactionRemark}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
      </div>
  );
}


