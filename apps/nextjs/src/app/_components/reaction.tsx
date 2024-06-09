"use client";
import Webcam from "react-webcam";
import type { FC } from "react";
import React, { useEffect, useRef, useCallback, useState } from "react";

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

export const VideoVerify = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc)
  }, [webcamRef]);

  const send = async () => {
    const bodyFormData = new FormData();
    const blob = await fetch(imgSrc).then((res) => res.blob())
    // const image = fs.readFileSync(blob.path);
    // const b64Image = Buffer.from(image).toString('base64');
    // bodyFormData.append('file', imageSrc);
    bodyFormData.append('file', blob)
    const resp = await fetch("http://192.168.5.127:5000/upload", {
      method: "POST",
      body: bodyFormData,
    }).then((response) => console.log(response))
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  return (<div className="container">
    {imgSrc ? (
      <div>
        <img src={imgSrc} alt="webcam" />
        <Button onClick={send}>Send</Button></div>
    ) : (
      <div>
        <Webcam height={600} width={600} ref={webcamRef} />
        <Button onClick={capture}>Capute</Button>
      </div>
    )
    }
  </div >)

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
              <DrawerDescription>
                {reactionRemark} - {reactionTime > 0.45 ? "FAILED" : "PASSED"}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              {reactionTime < 0.45 && (
                <Button onClick={() => submitScore?.(reactionTime)}>
                  Submit
                </Button>
              )}

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
