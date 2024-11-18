// src/components/AIResponse.js
import React from 'react';

const AIResponse = ({ response }) => (
  <div>
    <h3>Generated Roadmap:</h3>
    <p>{response}</p>
  </div>
);

export default AIResponse;
