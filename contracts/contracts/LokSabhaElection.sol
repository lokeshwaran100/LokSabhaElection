// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";

contract LokSabhaElection {
    event TestEvent(
        uint reveal0,
        uint reveal1,
        uint reveal2,
        uint reveal3,
        uint pincode
    );

    struct Candidate {
        string name;
        string party;
        uint[] pincodes;
        uint voteCount;
    }

    string public electionName;
    address public anonAadhaarVerifierAddr;

    // List of candidates
    Candidate[] public candidates;

    // Mapping to track if a userNullifier has already voted
    mapping(uint256 => bool) public hasVoted;

    // Constructor to initialize election and candidates
    constructor(
        string memory _electionName,
        address _verifierAddr,
        string[] memory candidateNames,
        string[] memory parties,
        uint[][] memory candidatePincodes
    ) {
        anonAadhaarVerifierAddr = _verifierAddr;
        electionName = _electionName;
        require(
            candidateNames.length == parties.length && candidateNames.length == candidatePincodes.length,
            "[LokSabhaElection]: Input arrays must have the same length"
        );
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], parties[i], candidatePincodes[i], 0));
        }
    }

    /// @dev Convert an address to uint256, used to check against signal.
    /// @param _addr: msg.sender address.
    /// @return Address msg.sender"s address in uint256
    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }

    /// @dev Register a vote in the contract.
    /// @param candidateIndex: Index of the candidate you want to vote for.
    /// @param nullifierSeed: Nullifier Seed used while generating the proof.
    /// @param nullifier: Nullifier for the citizen"s Aadhaar data.
    /// @param timestamp: Timestamp of when the QR code was signed.
    /// @param signal: signal used while generating the proof, should be equal to msg.sender.
    /// @param revealArray: Array of the values used as input for the proof generation (equal to [0, 0, 0, 0] if no field reveal were asked).
    /// @param groth16Proof: SNARK Groth16 proof.
    function voteForCandidate(
        uint256 candidateIndex,
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] memory revealArray, 
        uint[8] memory groth16Proof
    ) public {
        require(
            candidateIndex < candidates.length,
            "[LokSabhaElection]: Invalid candidate index"
        );
        require(
            addressToUint256(msg.sender) == signal,
            "[LokSabhaElection]: Wrong citizen signal sent."
        );
        // require(
        //     isLessThan3HoursAgo(timestamp) == true,
        //     "[LokSabhaElection]: Proof must be generated with Aadhaar data generated less than 3 hours ago."
        // );
        require(
            IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(
                nullifierSeed, // nullifier seed
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ) == true,
            "[LokSabhaElection]: Proof sent is not valid."
        );
        // Check that citizen hasn"t already voted
        require(
            !hasVoted[nullifier],
            "[LokSabhaElection]: Citizen has already voted"
        );

        // Check that the voter belongs to the candidate"s pincode
        bool isEligible = false;
        for (uint256 i = 0; i < candidates[candidateIndex].pincodes.length; i++) {
            emit TestEvent(revealArray[0],revealArray[1],revealArray[2],revealArray[3],candidates[candidateIndex].pincodes[i]);
            if (candidates[candidateIndex].pincodes[i] == revealArray[2]) {
                isEligible = true;
                break;
            }
        }
        require(isEligible, "[LokSabhaElection]: Voter does not belong to candidate's pincode");

        candidates[candidateIndex].voteCount++;
        hasVoted[nullifier] = true;

        // emit Voted(msg.sender, candidateIndex);
    }

    // Function to get the total number of candidates
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    // Function to get candidate information by index
    function getCandidate(
        uint256 candidateIndex
    ) public view returns (string memory, string memory, uint256) {
        require(
            candidateIndex < candidates.length,
            "[LokSabhaElection]: Invalid candidate index"
        );

        Candidate memory candidate = candidates[candidateIndex];
        return (candidate.name, candidate.party, candidate.voteCount);
    }

    // Function to check if a citizen has already voted
    function checkVoted(uint256 _nullifier) public view returns (bool) {
        return hasVoted[_nullifier];
    }
}
