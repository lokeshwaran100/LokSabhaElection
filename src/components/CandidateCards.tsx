import React, { useEffect, useState } from 'react';
import candidatesData from "../../public/LokSabhaCandidates.json";
// import './styles.css'; // Import the styles

interface CandidateCardsProps {
    pincode: string;
    onCandidateSelection: (candidate_id: string) => void;
}

const CandidateCards = (props: CandidateCardsProps) => {
    const [filteredCandidates, setFilteredCandidates] = useState<Map<string, any> | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

    useEffect(() => {
        // Filter candidates based on the given pincode
        let candidates = new Map<string, any>();
        candidatesData.candidates.map((candidate, index) => {
            if (candidate.pincodes.includes(parseInt(props.pincode))) {
                candidates.set(JSON.stringify(index), candidate);
            }
        });

        setFilteredCandidates(candidates);
        setSelectedCandidate(null); // Reset selected candidate when pincode changes
    }, [props.pincode]);

    const handleCardClick = (index: string) => {
        setSelectedCandidate(index);
        props.onCandidateSelection(index);
    };

    return (
        <div className="candidate-cards">
            {filteredCandidates &&
                Array.from(filteredCandidates.entries()).map(([index, candidate]) => (
                    <div
                        key={index}
                        className={`candidate-card ${selectedCandidate === index ? 'selected' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className='flex'>
                            <img
                                src={candidate.partyImage}
                                alt={`${candidate.party}`}
                                className="party-image"
                            />
                        </div>
                        <div className='flex'>
                            <img
                                src={candidate.candidateImage}
                                alt={`${candidate.name}`}
                                className="candidate-image"
                            />
                            <h3>{candidate.name}</h3>
                        </div>

                        <p>{candidate.party}</p>
                    </div>
                ))
            }
        </div >
    );
};

export default CandidateCards;