'use client';
import React, { useState } from 'react';
import tenders from './data/tenders.json';

const Home = () => {
  const [proposals, setProposals] = useState<{[key: number]: string}>({});

  const generateProposal = async (tenderTitle: string, index: number) => {
    // MOCK AI RESPONSE - WORKS IMMEDIATELY
    const mockProposal = `🚀 AI-GENERATED PROPOSAL FOR: ${tenderTitle}\n
📅 Timeline: 6-8 months
💰 Budget: Competitive pricing
🏗️ Experience: 15+ years in construction
👷 Team: Certified engineers
✅ Quality: ISO 9001 certified

We guarantee timely completion with highest quality standards!`;

    // Show loading then display proposal
    setProposals(prev => ({ ...prev, [index]: "Generating proposal..." }));
    
    setTimeout(() => {
      setProposals(prev => ({ ...prev, [index]: mockProposal }));
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Tender Marketplace</h1>
      
      {tenders.map((tender, index) => (
        <div key={index} style={{ 
          border: '2px solid #0070f3', 
          padding: '15px', 
          margin: '15px', 
          borderRadius: '8px',
          background: '#f9f9f9'
        }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0' }}>{tender.title}</h3>
          <p><strong>Deadline:</strong> {tender.deadline}</p>
          <p><strong>Value:</strong> {tender.value}</p>
          
          <div style={{ marginTop: '15px' }}>
            <button 
              onClick={() => generateProposal(tender.title, index)}
              style={{ 
                padding: '10px 20px', 
                background: '#0070f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Generate Proposal
            </button>
          </div>
          
          {proposals[index] && (
            <div style={{ 
              marginTop: '15px', 
              padding: '15px', 
              background: '#e8f4ff', 
              borderRadius: '5px',
              border: '1px solid #0070f3'
            }}>
              <strong>AI Proposal:</strong>
              <p style={{ whiteSpace: 'pre-line', margin: '10px 0 0 0' }}>{proposals[index]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;