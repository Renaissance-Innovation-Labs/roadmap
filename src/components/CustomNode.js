// src/components/CustomNode.js
import React from 'react';

const CustomNode = ({ data }) => {
  return (
    <div style={{
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: data.completed ? '#FFE599' : '#FFD966',
      color: '#333',
      border: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 'bold',
    }}>
      <span>{data.label}</span>
      {data.completed && <span style={{ color: 'green', fontSize: '1.5em' }}>✔</span>}
    </div>
  );
};

export default CustomNode;
