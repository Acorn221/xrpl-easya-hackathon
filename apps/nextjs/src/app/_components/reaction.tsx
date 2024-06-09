"use client";

import type { FC } from "react";
import React, { useEffect } from "react";

import { Button } from "@sobrxrpl/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@sobrxrpl/ui/drawer";

interface GameProps {
  submitScore?: (score: number) => Promise<void>;
}

export const Game: FC<GameProps> = ({ submitScore }) => {
  const [started, setStarted] = React.useState(false);
  const [color, setColor] = React.useState("fff");
  const [colorGeneratedAt, setColorGeneratedAt] = React.useState(0);
  const [reactionTime, setReactionTime] = React.useState(0);
  const [reactionRemark, setReactionRemark] = React.useState("");
  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
    setColorGeneratedAt(Date.now());
  };
  const [isOpen, setIsOpen] = React.useState(false);
  useEffect(() => {
    window.addEventListener("click", handleStop);
    return () => {
      window.removeEventListener("click", handleStop);
    };
  }, [colorGeneratedAt]);
  function handleStart() {
    setStarted(true);
    setTimeout(
      () => {
        generateColor();
      },
      2000 + Math.floor(Math.random() * 5000),
    );
  }
  function handleStop() {
    if (colorGeneratedAt > 0) {
      const normedReactionTime = (Date.now() - colorGeneratedAt) / 1000;
      setStarted(false);
      setReactionTime(normedReactionTime);
      setColorGeneratedAt(0);
      setColor("fff");
      setIsOpen(true);
      if (normedReactionTime < 0.2)
        setReactionRemark("Well done! You are super sharp!");
      if (normedReactionTime >= 0.2 && normedReactionTime < 0.6)
        setReactionRemark("Nice!");
      if (normedReactionTime >= 0.6 && normedReactionTime < 1)
        setReactionRemark("Are you sober?");
      if (normedReactionTime >= 1) setReactionRemark("Did you fall asleep?");
    }
  }

  return (
    <div className="relative flex h-full w-full flex-row justify-center rounded-lg p-4 align-middle">
      {started && (
        <div
          className="absolute m-auto flex min-h-56 min-w-56 flex-grow rounded-lg p-1"
          style={{ backgroundColor: `#${color}` }}
        ></div>
      )}
      <div className="relative flex-grow">
        <div className="flex flex-row gap-4 ">
          {!started && <Button onClick={handleStart}>Start</Button>}
        </div>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Your Reaction Time </DrawerTitle>
              <DrawerDescription>
                Reaction time: {reactionTime} seconds
              </DrawerDescription>
              <DrawerDescription>{reactionRemark}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={() => submitScore?.(reactionTime)}>
                Submit
              </Button>
              <DrawerClose>
                <Button variant="outline">Try Again</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
