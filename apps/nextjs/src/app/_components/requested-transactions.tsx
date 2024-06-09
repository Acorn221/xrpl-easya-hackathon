import Link from "next/link";

import { Button } from "@sobrxrpl/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sobrxrpl/ui/card";

import { api } from "~/trpc/server";

export const RequestedTransactionsIndicator = async () => {
  const requestedTransactions = await api.wallet.getAllRequestedTransactions();

  if (!requestedTransactions) {
    return null;
  }

  if (requestedTransactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requested Transactions Pending</CardTitle>
        <CardDescription>
          You have {requestedTransactions.length} transactions pending. Complete
          the verification process to send them.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-2">
        {requestedTransactions.map((transaction) => (
          <Link
            href={`/requested-transactions/${transaction.requested_transaction.id}`}
            key={transaction.requested_transaction.id}
            className="w-full"
          >
            <Button className="w-full" variant="link">
              {parseInt(transaction.requested_transaction.amount, 10) / 1000000}{" "}
              to {transaction.requested_transaction.destination}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
