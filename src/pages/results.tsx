/* eslint-disable react-hooks/exhaustive-deps */
import { getCandidateVotes } from "@/utils";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "./_app";
import { Loader } from "@/components/Loader";
import { icons } from "@/styles/illustrations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAnonAadhaar } from "@anon-aadhaar/react";
import candidatesData from "../../public/LokSabhaCandidates.json";

interface Candidate {
  name: string;
  party: string;
  voteCount: number;
}

interface CandidatesData {
  candidates: Candidate[];
}

export default function Results() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { useTestAadhaar } = useContext(AppContext);
  const router = useRouter();
  const [, startReq] = useAnonAadhaar();
  const blob = new Blob([icons.leftArrow], { type: "image/svg+xml" });
  const leftArrow = useMemo(() => URL.createObjectURL(blob), [icons.leftArrow]);

  const updateCandidates = async () => {
    let candidates: Candidate[] = [];
    for (const [index, candidate] of candidatesData.candidates.entries()) {
      let vote_count = await getCandidateVotes(useTestAadhaar, JSON.stringify(index));
      candidates.push({
        name: candidate.name,
        party: candidate.party,
        voteCount: vote_count.toString()
      });
    }

    setCandidates(candidates);
  };

  useEffect(() => {
    updateCandidates();
  }, []);

  useEffect(() => {
    updateCandidates();
  }, [useTestAadhaar]);

  const onStartAgain = () => {
    startReq({ type: "logout" });
    router.push("/");
  };

  return (
    <main className="flex flex-col min-h-[75vh] mx-auto justify-around items-center w-full p-4">
      <div className="max-w-4xl w-full">
        <h2 className="text-[30px] font-rajdhani text-center font-medium leading-none">
          VOTING RESULTS
        </h2>
      </div>
      <div className="candidate-results">
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Party</th>
              <th>Vote Count</th>
            </tr>
          </thead>
          <tbody>
            {candidates &&
              candidates.map((candidate, index) => (
                <tr key={index}>
                  <td>{candidate.name}</td>
                  <td>{candidate.party}</td>
                  <td>{candidate.voteCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="font-lg">
        <div
          onClick={() => onStartAgain()}
          className="flex flex-row justify-center gap-2 mt-5 hover:underline cursor-pointer"
        >
          <Image alt="left arrow" src={leftArrow} height={16} width={16} />
          <p className="text-[#535665] font-rajdhani font-semibold">
            START AGAIN
          </p>
        </div>
      </p>
    </main>
  );
}
