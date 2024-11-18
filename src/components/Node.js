// src/components/Node.js
import React from 'react';

const Node = ({ title, description, isCompleted, toggleComplete }) => (
  <div
    onClick={toggleComplete}
    style={{
      padding: '10px',
      border: '1px solid black',
      backgroundColor: isCompleted ? 'lightgreen' : 'lightgray',
    }}
  >
    <h3>{title}</h3>
    <p>{description}</p>
    <small>{isCompleted ? 'Completed' : 'Incomplete'}</small>
  </div>
);

export default Node;
