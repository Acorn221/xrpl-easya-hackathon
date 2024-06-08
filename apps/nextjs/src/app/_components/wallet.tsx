"use client";

import { useState } from "react";
import { Button } from "@sobrxrpl/ui/button";
import { Input } from "@sobrxrpl/ui/input";
import { toast } from "@sobrxrpl/ui/toast";

import { api } from "../../trpc/react";

export const CreateWallet = () => {
  const [walletName, setWalletName] = useState<string>("");

  const createWallet = api.wallet.create.useMutation({
    onSuccess: () => {
      setWalletName("");
      toast.success("Wallet created");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create wallet");
    },
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
      />
      <Button onClick={() => createWallet.mutate({ name: walletName })} />
    </form>
  );
};

export const WalletManager = () => {
  const wallet = api.wallet.getAll.useQuery();

  return (
    <div>
      <CreateWallet />
      <div>{wallet.data?.map((w) => <div key={w.id}>{w.name}</div>)}</div>
    </div>
  );
};
