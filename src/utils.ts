import { ethers } from "ethers";
import votingAbi from "../public/LokSabhaElection.json";

const providerUrl = process.env.NEXT_PUBLIC_RPC_URL;

export const getCandidateVotes = async (useTestAadhaar: boolean, candidateId: string): Promise<any> => {

  const provider = ethers.getDefaultProvider(providerUrl);
  const voteContract = new ethers.Contract(
    `0x${useTestAadhaar
      ? process.env.NEXT_PUBLIC_LOKSABHA_ELECTION_CONTRACT_ADDRESS
      : process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD
    }`,
    votingAbi,
    provider
  );

  // const { _name, _party, voteCount } = await voteContract.getCandidate(candidateId);
  const [_name, _party, voteCount] = await voteContract.getCandidate(candidateId);
  console.log(typeof (voteCount))

  // // Initialize a variable to store the total vote count
  // let totalVoteCount = 0;

  // // Iterate through the proposals and sum their vote counts
  // for (let i = 0; i < proposalCount; i++) {
  //   const voteCount = await voteContract.getProposal(i);
  //   totalVoteCount += Number(voteCount[1]);
  // }

  // await Promise.all(
  //   voteBreakdown.map(async (rating) => {
  //     const voteCount = await voteContract.getProposal(rating.rating);
  //     const percentage = Math.floor(
  //       (Number(voteCount[1]) / totalVoteCount) * 100
  //     );
  //     rating.percentage = percentage;
  //   })
  // );

  return voteCount;
};

export const hasVoted = async (
  userNullifier: string,
  useTestAadhaar: boolean
): Promise<boolean> => {
  const provider = ethers.getDefaultProvider(providerUrl);
  const voteContract = new ethers.Contract(
    `0x${useTestAadhaar
      ? process.env.NEXT_PUBLIC_LOKSABHA_ELECTION_CONTRACT_ADDRESS
      : process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD
    }`,
    votingAbi,
    provider
  );

  return await voteContract.checkVoted(userNullifier);
};

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
