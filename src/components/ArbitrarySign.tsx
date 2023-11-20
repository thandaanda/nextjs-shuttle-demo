"use client";

import { useState } from "react";
import { useShuttle } from "@delphi-labs/shuttle-react";

import useWallet from "@/hooks/useWallet";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";

export function ArbitrarySign() {
  const { signArbitrary, recentWallet } = useShuttle();
  const wallet = useWallet();

  const [data, setData] = useState("Hello world");

  const onSign = () => {
    const bytes = Buffer.from(data, "utf-8");
    signArbitrary({
      wallet,
      data: bytes,
    })
      .then(async (result) => {
        console.log("sign arbitrary result", result);

        console.group("###### verifying signature.... ########");

        const pubKey = Buffer.from(result.response.pub_key.value, "base64");
        const signature = Buffer.from(result.response.signature, "base64");
        const verification = verifyADR36Amino(
          "inj",
          recentWallet?.account.address as string,
          bytes,
          pubKey,
          signature,
          "ethsecp256k1"
        );
        console.log("verification result:", verification);
        alert(
          verification
            ? "Signature successfully verified"
            : "Signature verification failed"
        );
        console.log("####################################");
        console.groupEnd();
      })
      .catch((error) => {
        console.error("sign arbitrary error", error);
      });
  };

  return (
    <>
      <h2>Sign arbitrary</h2>
      <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        style={{ width: "450px", height: "100px" }}
      />
      <button disabled={!recentWallet?.account.address} onClick={onSign}>
        Sign
      </button>
    </>
  );
}
