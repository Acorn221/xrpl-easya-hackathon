"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@sobrxrpl/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sobrxrpl/ui/dialog";
import { Input } from "@sobrxrpl/ui/input";
import { Label } from "@sobrxrpl/ui/label";
import { toast } from "@sobrxrpl/ui/toast";

import { api } from "~/trpc/react";

type MakeTransactionModalProps = {
  walletId: string;
};

export const MakeTransactionModal: FC<MakeTransactionModalProps> = ({
  walletId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [destination, setDestination] = useState("");
  const router = useRouter();

  const makeTransaction = api.wallet.makeTransaction.useMutation({
    onError: (err) => {
      toast.error("Failed to send transaction, " + err.message);
    },
  });

  useEffect(() => {
    if (makeTransaction.data === true) {
      toast.success("Transaction was successful!");
      setModalOpen(false);
      router.refresh();
    } else if (makeTransaction.data) {
      const { requestedTransactionId, verifiedOptions } = makeTransaction.data;
      const firstOption = verifiedOptions.methods?.[0];
      if (!firstOption) {
        return;
      }
      router.replace(`/verify/${requestedTransactionId}/${firstOption.id}`);
    }
  }, [makeTransaction.data]);

  return (
    <Dialog open={modalOpen} onOpenChange={(e) => setModalOpen(e)}>
      <DialogTrigger asChild onClick={() => setModalOpen(true)}>
        <Button>Send XRP</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send XRP</DialogTitle>
          <DialogDescription>Send XRP to another wallet</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="100"
              className="col-span-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destination" className="text-right">
              Destination Address
            </Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="col-span-3"
              placeholder="r3s37pJtdyoY6fWQYAYDKjSmKXeskx97yt"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              makeTransaction.mutate({
                id: walletId,
                amount: `${parseInt(amount, 10) * 1000000}`,
                destination,
              });
            }}
            disabled={makeTransaction.isPending}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
