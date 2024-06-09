import { FC } from "react";
import { Button } from "@sobrxrpl/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sobrxrpl/ui/card";

import { api } from "../../../trpc/server";
import { MakeTransactionModal } from "./_components/make-transaction-modal";

type WalletPageParams = {
  params: {
    walletId: string;
  };
};

const WalletPage: FC<WalletPageParams> = async ({ params }) => {
  const data = await api.wallet.getById({ id: params.walletId });
  const balance = await api.wallet.getBalance({ id: params.walletId });

  if (!data) {
    return <div>Error getting wallet</div>;
  }

  return (
    <Card className="w-full p-4 md:w-2/3">
      <CardHeader>
        <CardTitle className="flex text-3xl">
          <div className="flex-1">"{data.name}" Wallet</div>
          <div className="">{balance} XRP</div>
        </CardTitle>
        <CardDescription>
          <code>{data.fullWallet.classicAddress}</code>
        </CardDescription>
        <CardContent>
          <MakeTransactionModal walletId={params.walletId} />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default WalletPage;
