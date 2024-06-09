import { Button } from "@sobrxrpl/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sobrxrpl/ui/card";

import { api } from "../../trpc/server";

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
      <CardContent>
        {requestedTransactions.map((transaction) => (
          <Button>
            {transaction.requested_transaction.amount} to{" "}
            {transaction.requested_transaction.destination}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
