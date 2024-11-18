// src/components/Flowchart.js
import React from 'react';
import ReactFlow, { Controls, Background } from 'react-flow-renderer';

const Flowchart = ({ nodes = [], edges = [] }) => { // Default to empty array
  const elements = [...nodes, ...edges]; // Combine nodes and edges

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        elements={elements}
        style={{ background: '#f5f5f5' }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        fitViewOptions={{ padding: 0.1 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;
