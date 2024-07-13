/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import {
  AnonAadhaarCore,
  deserialize,
  packGroth16Proof,
} from "@anon-aadhaar/core";
import { useEffect, useState, useContext } from "react";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import anonAadhaarVote from "../../public/LokSabhaElection.json";
import { hasVoted } from "@/utils";
import { AppContext } from "./_app";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../config";
import CandidateCards from "@/components/CandidateCards";

export default function Vote() {
  const [anonAadhaar] = useAnonAadhaar();
  const { useTestAadhaar, setVoted } = useContext(AppContext);
  const [, latestProof] = useProver();
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [candidateId, setCandidateId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const sendVote = async (
    _candidateId: string,
    _anonAadhaarCore: AnonAadhaarCore
  ) => {
    const packedGroth16Proof = packGroth16Proof(
      _anonAadhaarCore.proof.groth16Proof
    );
    setIsLoading(true);
    try {
      const voteTx = await writeContract(wagmiConfig, {
        abi: anonAadhaarVote,
        address: `0x${useTestAadhaar
          ? process.env.NEXT_PUBLIC_LOKSABHA_ELECTION_CONTRACT_ADDRESS
          : process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD
          }`,
        functionName: "voteForCandidate",
        args: [
          _candidateId,
          _anonAadhaarCore.proof.nullifierSeed,
          _anonAadhaarCore.proof.nullifier,
          _anonAadhaarCore.proof.timestamp,
          address,
          [
            _anonAadhaarCore.proof.ageAbove18,
            _anonAadhaarCore.proof.gender,
            _anonAadhaarCore.proof.pincode,
            _anonAadhaarCore.proof.state,
          ],
          packedGroth16Proof,
        ],
      });
      console.log("Vote transaction: ", voteTx);
      const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: voteTx,
        pollingInterval: 1_000
      });
      console.log("Vote Transaction Receipt: ", transactionReceipt);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    // To do: fix the hook in the react lib
    const aaObj = localStorage.getItem("anonAadhaar");
    if (aaObj) {
      const anonAadhaarProofs = JSON.parse(aaObj!).anonAadhaarProofs;

      deserialize(
        anonAadhaarProofs[Object.keys(anonAadhaarProofs).length - 1].pcd
      ).then((result) => {
        setAnonAadhaarCore(result);
      });
    }
  }, [anonAadhaar, latestProof]);

  useEffect(() => {
    anonAadhaarCore?.proof.nullifier
      ? hasVoted(anonAadhaarCore?.proof.nullifier, useTestAadhaar).then(
        (response) => {
          // if (response) router.push("/results");
          setVoted(response);
        }
      )
      : null;
  }, [useTestAadhaar, router, setVoted, anonAadhaarCore]);

  useEffect(() => {
    if (isSuccess) router.push("./results");
    if (isSuccess) setVoted(true);
  }, [router, isSuccess]);

  useEffect(() => {
    if (!anonAadhaar || anonAadhaar.status !== "logged-in") {
      router.push(".");
    }
  }, [anonAadhaar, router]);

  const onCandidateSelection = (candidate_id: string) => {
    setCandidateId(candidate_id);
  };

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
        <div className="max-w-4xl w-full">
          <div className="justify-center items-center place-content-center">
            <h3 className="text-[35px] font-rajdhani font-medium ">
              CAST YOUR VOTE
            </h3>
          </div>

          <div className="flex flex-col gap-5">
            {anonAadhaarCore !== undefined &&
              <CandidateCards
                pincode={anonAadhaarCore.proof.pincode}
                onCandidateSelection={onCandidateSelection}
              />}

            <div>
              {isConnected ? (
                isLoading ? (
                  <Loader />
                ) : (
                  <button
                    disabled={
                      candidateId === undefined || anonAadhaarCore === undefined
                    }
                    type="button"
                    className="inline-block mt-5 bg-[#009A08] rounded-lg text-white px-14 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                    onClick={() => {
                      if (candidateId !== undefined && anonAadhaarCore !== undefined)
                        sendVote(candidateId, anonAadhaarCore);
                    }}
                  >
                    VOTE
                  </button>
                )
              ) : (
                <button
                  disabled={true}
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                  You need to connect your wallet first ⬆️
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
