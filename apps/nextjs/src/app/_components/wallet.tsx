"use client";

import { FC, useState } from "react";
import { ArrayElement, RouterOutputs } from "@sobrxrpl/api";
import { Button } from "@sobrxrpl/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@sobrxrpl/ui/card";
import { Input } from "@sobrxrpl/ui/input";
import { Separator } from "@sobrxrpl/ui/separator";
import { toast } from "@sobrxrpl/ui/toast";

import { api } from "../../trpc/react";

type CreateWalletProps = {
  onComplete: () => void;
};

export const CreateWallet: FC<CreateWalletProps> = ({ onComplete }) => {
  const [walletName, setWalletName] = useState<string>("");

  const createWallet = api.wallet.create.useMutation({
    onSuccess: () => {
      setWalletName("");
      toast.success("Wallet created");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create wallet, " + err.message);
    },
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <Input
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
        placeholder="Wallet Name"
      />
      <Button onClick={() => createWallet.mutate({ name: walletName })}>
        Create a wallet
      </Button>
    </form>
  );
};

type DisplayedWalletProps = {
  data: ArrayElement<RouterOutputs["wallet"]["getAll"]>;
};

export const DisplayedWallet: FC<DisplayedWalletProps> = ({ data }) => {
  return (
    <Button variant="secondary" className="flex justify-center align-middle">
      {data.name}
    </Button>
  );
};

export const WalletManager = () => {
  const wallet = api.wallet.getAll.useQuery();
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage your wallets</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {createOpen ? (
          <CreateWallet onComplete={() => setCreateOpen(false)} />
        ) : (
          <Button onClick={() => setCreateOpen(true)}>Create a wallet</Button>
        )}
        <Separator />
        <div className="flex flex-col gap-2">
          {wallet.data?.map((w) => <DisplayedWallet key={w.id} data={w} />)}
        </div>
      </CardContent>
    </Card>
  );
};
