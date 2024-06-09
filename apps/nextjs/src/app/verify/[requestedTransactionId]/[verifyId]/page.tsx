"use server";

import type { FC } from "react";
import { redirect } from "next/navigation";

import { Game } from "~/app/_components/reaction";
import styles from "~/app/challenge/reaction/styles.module.css";
import { api } from "~/trpc/server";
import { VerifyButton } from "./verifyButton";

interface VerifyPageProps {
  params: {
    requestedTransactionId: string;
    verifyId: string;
  };
}

const VerifyPage: FC<VerifyPageProps> = async ({ params }) => {
  const requestedTransaction = await api.wallet.getRequestedTransaction({
    id: params.requestedTransactionId,
  });

  if (!requestedTransaction) {
    return <div>Transaction not found</div>;
  }

  const verificationItem =
    requestedTransaction.requested_transaction.verifiedOptions.methods.find(
      (method) => method.id === params.verifyId,
    );

  if (!verificationItem) {
    return <div>Verification method not found</div>;
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
      {/* <VerifyButton verify={handleVerified} /> */}
      {verificationItem.name === "ReactionTest" && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Reaction Game
          </h1>
          <p>
            Click on "Start" first, and wait until the color of the white dot
            that changes color. As soon as it changes, hit click any where on
            the screen.
          </p>
          <div className="relative flex h-screen w-full flex-grow">
            <Game
              submitScore={async (score) => {
                "use server";

                if (score < 0.45) {
                  return handleVerified();
                }
              }}
            />
            <div>
              {[...Array(10)].map((e, i) => (
                <div className={styles.mblock}></div>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
