"use server";

import type { FC } from "react";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { VerifyButton } from "./verifyButton";

interface VerifyPageProps {
  params: {
    requestedTransactionId: string;
    verifyId: string;
  };
}

const VerifyPage: FC<VerifyPageProps> = ({ params }) => {
  const requestedTransaction = api.wallet.getRequestedTransaction({
    id: params.requestedTransactionId,
  });

  if (!requestedTransaction) {
    return <div>Transaction not found</div>;
  }

  const handleVerified = async () => {
    "use server";
    console.log("verify");

    const result = await api.wallet.verifyOption({
      requestedTransactionId: params.requestedTransactionId,
      verifiedOptionId: params.verifyId,
    });

    if (result === true) {
      redirect(`/requested-transactions/${params.requestedTransactionId}`);
    } else if (Array.isArray(result)) {
      const nextUnverifiedOption = result.find((method) => !method.verified);
      if (!nextUnverifiedOption) {
        throw new Error("No unverified option found");
      }
      // redirect to the first verification option
      redirect(
        `/verify/${params.requestedTransactionId}/${nextUnverifiedOption.id}`,
      );
    }
  };

  return (
    <div>
      <h1>Verify</h1>
      <div>Transaction ID: {params.requestedTransactionId}</div>
      <div>Verify ID: {params.verifyId}</div>
      <VerifyButton verify={handleVerified} />
    </div>
  );
};

export default VerifyPage;
