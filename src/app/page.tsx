'use client';
import React, { useState } from 'react';
import tenders from './data/tenders.json';
const Home = () => {
  const [proposals, setProposals] = useState<{[key: number]: string}>({});

  const generateProposal = async (tenderTitle: string, index: number) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Generate a proposal for: ${tenderTitle}` })
      });
      
      const data = await response.json();
      setProposals(prev => ({ ...prev, [index]: data.text }));
    } catch (error) {
      setProposals(prev => ({ ...prev, [index]: 'Failed to generate proposal' }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tender Marketplace</h1>
      {tenders.map((tender, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{tender.title}</h3>
          <p>Deadline: {tender.deadline}</p>
          <p>Value: {tender.value}</p>
          <a href={tender.link}>View Details</a>
          
          <button 
            onClick={() => generateProposal(tender.title, index)}
            style={{ marginTop: '10px', padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Generate Proposal
          </button>
          
          {proposals[index] && (
            <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <strong>AI Proposal:</strong>
              <p>{proposals[index]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;