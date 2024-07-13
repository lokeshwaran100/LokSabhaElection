// @ts-ignore
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import * as fs from 'fs';

// require("dotenv").config({ path: "../../.env.local" });
require("dotenv").config({ path: "../../.env" });

// Define the structure of the candidate data
interface Candidate {
  name: string;
  party: string;
  partyImage: string;
  candidateImage: string;
  pincodes: number[];
}

interface CandidatesData {
  candidates: Candidate[];
}

// Read the JSON file
const data: CandidatesData = JSON.parse(fs.readFileSync('candidates.json', 'utf-8'));

// Generate the arrays for the Solidity contract parameters
const candidateNames: string[] = data.candidates.map(candidate => candidate.name);
const parties: string[] = data.candidates.map(candidate => candidate.party);
const candidatePincodes: number[][] = data.candidates.map(candidate => candidate.pincodes);

const candidateNamesSol = JSON.stringify(candidateNames).replace(/"/g, '\\"');
const partiesSol = JSON.stringify(parties).replace(/"/g, '\\"');
const candidatePincodesSol = JSON.stringify(candidatePincodes);

async function main() {
  const lokSabhaElection = await ethers.deployContract("LokSabhaElection", [
    "Lok Sabha Election 2024",
    "0x" + process.env.NEXT_PUBLIC_ANON_AADHAAR_CONTRACT_ADDRESS,
    candidateNamesSol,
    partiesSol,
    candidatePincodesSol
  ]);

  await lokSabhaElection.waitForDeployment();

  console.log(`LokSabha Election contract deployed to ${await lokSabhaElection.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
