import { FC } from "react";

import { api } from "~/trpc/server";

type VerifyPageProps = {
  params: {
    requestedTransactionId: string;
    verifyId: string;
  };
};

const VerifyPage: FC<VerifyPageProps> = ({ params }) => {
  const requestedTransaction = api.wallet.getRequestedTransaction({
    id: params.requestedTransactionId,
  });

  if (!requestedTransaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div>
      <h1>Verify</h1>
      <div>Transaction ID: {params.requestedTransactionId}</div>
      <div>Verify ID: {params.verifyId}</div>
    </div>
  );
};

export default VerifyPage;
