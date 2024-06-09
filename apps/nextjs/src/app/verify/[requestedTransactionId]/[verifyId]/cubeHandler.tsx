/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Script from "next/script";

import { Alert, AlertDescription, AlertTitle } from "@sobrxrpl/ui/alert";
import { Button } from "@sobrxrpl/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@sobrxrpl/ui/card";
import { Separator } from "@sobrxrpl/ui/separator";

interface CubeHandlerProps {
  targetTime: number;
  submit: () => void;
}

export const CubeHandler: FC<CubeHandlerProps> = ({ targetTime, submit }) => {
  const [solved, setSolved] = useState(false);
  const [connected, setConnected] = useState(false);
  const [startTimer, setStartTimer] = useState<boolean | number>(false);
  const [movesFromSolved, setMovesFromSolved] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solveTime, setSolveTime] = useState<number>(0);

  useEffect(() => {
    console.log(`Timne to beat: ${targetTime}`);
  }, []);

  const cubeSolvedCallback = useCallback(() => {
    setSolved(true);
  }, []);

  const cubeUnSolvedCallback = useCallback(() => {
    setSolved(false);
  }, []);

  const moveCallback = useCallback(
    (e: Event) => {
      setMovesFromSolved(movesFromSolved + 1);
      console.log(movesFromSolved + 1);
      // const {
      //   move,
      //   time,
      // }: {
      //   move: string;
      //   time: number;
      //   // @ts-ignore
      // } = e.detail;
    },
    [movesFromSolved],
  );

  useEffect(() => {
    window.addEventListener("cubeSolved", cubeSolvedCallback);
    window.addEventListener("unSolved", cubeUnSolvedCallback);
    // @ts-ignore
    window.addEventListener("move", moveCallback, []);
    return () => {
      window.removeEventListener("cubeSolved", cubeSolvedCallback);
      window.removeEventListener("unSolved", cubeUnSolvedCallback);
      window.removeEventListener("move", moveCallback);
    };
  }, [cubeSolvedCallback, cubeUnSolvedCallback, moveCallback]);

  const startSolve = useCallback(() => {
    setStartTimer(Date.now());
    setIsSolving(true);
  }, []);

  const setupCube = useCallback(() => {
    // @ts-ignore
    const cube = new GiikerCube();
    // @ts-ignore
    cube.init();
    setConnected(true);
    setMovesFromSolved(0);
  }, []);

  useEffect(() => {
    if (solved) {
      console.log(`resetting moves from solved`);
      setMovesFromSolved(0);
    }
  }, [solved, movesFromSolved]);

  useEffect(() => {
    if (isSolving && solved) {
      setIsSolving(false);
      setSolveTime(Math.floor((Date.now() - (startTimer as number)) / 1000));
    }
  }, [solved]);

  const isScrambled = useMemo(() => {
    return movesFromSolved > 20;
  }, [solved, movesFromSolved]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rubiks Cube Solve Time Test</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={() => setupCube()} disabled={connected}>
          Connect
        </Button>
        {solved ? "Solved" : "Not Solved"}
        <Separator />
        {isSolving ? (
          <Alert>
            <AlertTitle>Solving...</AlertTitle>
            <AlertDescription>
              Moves: {movesFromSolved}, Time:{" "}
              {Math.floor((Date.now() - (startTimer as number)) / 1000)}
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            {!isScrambled ? (
              "Scramble the cube"
            ) : (
              <Button onClick={startSolve}>Start Solve</Button>
            )}
          </div>
        )}
        {solveTime > 0 && (
          <>
            <Separator />
            {`Solve Time: ${solveTime} seconds`}
            <Separator />
            {solveTime < targetTime ? (
              <Button onClick={() => submit()}>Submit</Button>
            ) : (
              <Alert>
                <AlertTitle>
                  You were too slow, the time to beat is {targetTime}
                </AlertTitle>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
