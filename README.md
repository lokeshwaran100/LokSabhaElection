# Lok Sabha Election Project

## Overview

The Lok Sabha Election Project demonstrates how the Election Commission can leverage blockchain technology to conduct a transparent and secure general election. This application allows citizens to cast their votes for candidates using their Aadhaar card for identity verification. The voting system ensures that each vote is cast only for candidates matching the voter's pincode.

## Anon Aadhaar Protocol

This project utilizes the Anon Aadhaar protocol for Aadhaar identity verification. The application only reveals whether the voter is above 18 and the pincode the voter belongs to, hiding other personal information.

## Setup

### 1. Create `LokSabhaCandidates.json`

Create a `LokSabhaCandidates.json` file in the `public/` directory with the following structure:

```json
{
  "candidates": [
    {
      "name": "Candidate Name 1",
      "party": "Party Name 1",
      "partyImage": "path/to/partyImage1.png",
      "candidateImage": "path/to/candidateImage1.png",
      "pincodes": [110001, 110002]
    },
    {
      "name": "Candidate Name 2",
      "party": "Party Name 2",
      "partyImage": "path/to/partyImage2.png",
      "candidateImage": "path/to/candidateImage2.png",
      "pincodes": [110003, 110004]
    }
  ]
}
```
For reference, see the sample [LokSabhaCandidates.json](public/LokSabhaCandidates.json) file.

### 2. Deploy the Solidity Smart Contract

The smart contract `LokSabhaElection.sol` is located in the `contracts/contracts` directory. Update the `.env` file with `HARD_HAT_PRIVATE_KEY`, and `NEXT_PUBLIC_ANON_AADHAAR_CONTRACT_ADDRESS` variables without `0x` prefix along with `NEXT_PUBLIC_RPC_URL`. Deploy the contract using the following command from the `contracts` directory:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

### 3. Update `.env` File

After deploying the contract, update the `.env` file with the deployed contract address without `0x` prefix:

```plaintext
NEXT_PUBLIC_LOKSABHA_CONTRACT_ADDRESS=YourDeployedContractAddress
```

### 4. Deploy the Frontend

Navigate to the root directory and run the following commands to deploy the frontend:

```bash
yarn install
yarn build
yarn start
```

### 5. Generate Test Aadhaar QR Code

To cast a vote, you need to generate a test Aadhaar QR code using the Anon Aadhaar protocol. Follow the instructions provided at [Anon Aadhaar Documentation](https://documentation.anon-aadhaar.pse.dev/docs/generate-qr).

## Tech Stack

- **Solidity**: Smart contract development
- **TypeScript**: Script for deploying the smart contract
- **React**: Frontend development
- **Anon Aadhaar Protocol**: Identity verification

## Challenges

1. **Understanding Anon Aadhaar Protocol**: Significant time was spent understanding how the Anon Aadhaar protocol works to ensure secure and private identity verification.
2. **Frontend Development**: Integrating the blockchain functionalities with a user-friendly frontend was challenging but essential for providing a seamless user experience.

This project showcases how blockchain technology, combined with secure identity verification protocols, can be used to conduct transparent and efficient elections.
