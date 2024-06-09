"use client";

import type { FC } from "react";

import { Button } from "@sobrxrpl/ui/button";

interface VerifyButtonProps {
  verify: () => Promise<unknown>;
}

export const VerifyButton: FC<VerifyButtonProps> = ({ verify }) => {
  return <Button onClick={() => verify()}>Verify</Button>;
};
