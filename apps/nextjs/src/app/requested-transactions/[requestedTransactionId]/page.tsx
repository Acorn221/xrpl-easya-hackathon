import type { FC } from "react";
import Link from "next/link";
import { BadgeAlert, BadgeCheck } from "lucide-react";

import { Alert, AlertTitle } from "@sobrxrpl/ui/alert";
import { Button } from "@sobrxrpl/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sobrxrpl/ui/card";
import { Separator } from "@sobrxrpl/ui/separator";

import { api } from "../../../trpc/server";

interface RequestedTransactionPageProps {
  params: {
    requestedTransactionId: string;
  };
}

const RequestedTransactionPage: FC<RequestedTransactionPageProps> = async ({
  params,
}) => {
  const requestedTransactionId = params.requestedTransactionId;

  const data = await api.wallet.getRequestedTransaction({
    id: requestedTransactionId,
  });

  if (!data) {
    return null;
  }

  const { requested_transaction } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requested Transaction</CardTitle>
        <CardDescription>
          Here is your requested transaction, this is so you can complete the
          verification steps to send it.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.requested_transaction.status === "pending" ? (
          <Alert variant="default">
            <BadgeAlert className="h-8 w-8" />
            <AlertTitle className="text-xl">
              Transaction is pending. Please complete the verification steps
              below to send it.
            </AlertTitle>
          </Alert>
        ) : (
          <Alert>
            <BadgeCheck className="h-8 w-8" />

            <AlertTitle className="text-xl">
              Transaction has been made successfully.
            </AlertTitle>
          </Alert>
        )}
        <div>
          {parseInt(requested_transaction.amount, 10) / 1000000} to{" "}
          {requested_transaction.destination}
        </div>
        <Separator />
        <div className="text-2xl">Verification steps</div>
        <div>
          {requested_transaction.verifiedOptions.methods.map((method) => (
            <Link href={`/verify/${requested_transaction.id}/${method.id}`}>
              <Button disabled={method.verified} key={method.id}>
                {method.name}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestedTransactionPage;
