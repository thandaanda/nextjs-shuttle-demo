"use client";

import { useState } from "react";
import { useShuttle } from "@delphi-labs/shuttle-react";

import useWallet from "@/hooks/useWallet";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";

export function ArbitrarySign() {
  const { signArbitrary, recentWallet, verifyArbitrary } = useShuttle();
  const wallet = useWallet();
  const [verification, setVerification] = useState(0);
  const [result, setResult] = useState<any>(null);

  const [data, setData] = useState("Hello world");

  const metaMaskSign = async () => {
    const bytes = Buffer.from(data, "utf-8");
    try {
      const result = await signArbitrary({
        data: bytes,
      });

      setResult(result);

      const verification = await verifyArbitrary({
        data: bytes,
        signResult: result,
      });

      setVerification(verification ? 2 : 1);
      alert(
        verification
          ? "Signature successfully verified"
          : "Signature verification failed"
      );
    } catch (error) {
      console.error("sign arbitrary error", error);
    }
  };

  const leapKeplrBrowserSign = async () => {
    const bytes = Buffer.from(data, "utf-8");
    try {
      const result = await signArbitrary({
        data: data as any,
      });

      setResult(result);

      const verification = verifyADR36Amino(
        'inj',
        wallet.account.address,
        data,
        Buffer.from(result.response.pub_key.value, 'base64'),
        Buffer.from(result.response.signature, 'base64'),
        'ethsecp256k1'
      );

      setVerification(verification ? 2 : 1);
      alert(
        verification
          ? "Signature successfully verified"
          : "Signature verification failed"
      );
    } catch (error) {
      console.error("sign arbitrary error", error);
    }
  };

  const keplrMobileSign = async () => {
    const bytes = Buffer.from(data, "utf-8");
    try {
      // const result = await signArbitrary({
      //   data: bytes,
      // });
      const result: any = await window.walletConnect?.request({
        topic: wallet?.mobileSession?.walletConnectSession?.topic as string,
        chainId: `cosmos:${wallet.network.chainId}`,
        request: {
          method: "cosmos_signAmino",
          params: {
            signerAddress: wallet.account.address,
            signDoc: {
              chain_id: '',
              account_number: "0",
              sequence: "0",
              fee: {
                gas: "0",
                amount: [],
              },
              msgs: [
                {
                  type: "sign/MsgSignData",
                  value: {
                    signer: wallet.account.address,
                    data: Buffer.from(data).toString("base64"),
                  },
                },
              ],
              memo: "",
            },
        },
      },
      });

      setResult(result);
      

      const verification = verifyADR36Amino(
        'inj',
        wallet.account.address,
        data,
        Buffer.from(result.signature.pub_key.value, 'base64'),
        Buffer.from(result.signature.signature, 'base64'),
        'ethsecp256k1'
      );

      setVerification(verification ? 2 : 1);
      alert(
        verification
          ? "Signature successfully verified"
          : "Signature verification failed"
      );
    } catch (error) {
      console.error("sign arbitrary error", error);
    }
  };

  const onSign = () => {
    if (wallet.providerId == "mobile-leap-cosmos") {
      alert("Please use Leap browser to sign arbitrary data");
      return;
    }
    if (wallet.providerId.includes("metamask")) {
      metaMaskSign();
    } else if (
      wallet.providerId == "leap-cosmos" ||
      wallet.providerId == "keplr"
    ) {
      leapKeplrBrowserSign();
    } else if (wallet.providerId == "mobile-keplr") {
      keplrMobileSign();
    }
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
      {verification === 1 && <p>Signature verification failed</p>}
      {verification === 2 && <p>Signature successfully verified</p>}
      {result && <div>{JSON.stringify(result, null, 2)}</div>}
    </>
  );
}
