import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "react-flow-renderer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { generateRoadmap, generateDescription } from "../services/fetchAI";

// Custom Node Component with Transparent Styling
const CustomNode = ({ data }) => (
  <div
    style={{
      padding: "10px",
      backgroundColor: "black", // Semi-transparent background
      border: "1px solid rgba(51, 51, 51, 0.5)",
      borderRadius: "8px",
      fontWeight: "bold",
      minWidth: "150px",
      textAlign: "center",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    }}
  >
    {data.label}
    {data.completed && (
      <span style={{ color: "green", fontSize: "1.2em" }}>✔️</span>
    )}
    <Handle type="source" position={Position.Bottom} />
    <Handle type="target" position={Position.Top} />
  </div>
);

const Roadmap = ({ stack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  // Reference for the roadmap container
  const roadmapRef = useRef(null);

  // Fetch roadmap data based on selected stack
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const roadmapData = await generateRoadmap(stack);
        setNodes(roadmapData.nodes);
        setEdges(roadmapData.edges);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch roadmap data:", err);
        setError("Failed to load roadmap. Please try again.");
        setLoading(false);
      }
    };

    if (stack) {
      fetchRoadmap();
    }
  }, [stack]);

  // Fetch description for the selected topic and open the sidebar
  const openSidebar = async (topic) => {
    setDescriptionLoading(true);
    try {
      let description = await generateDescription(topic);
      // Remove asterisks from the description
      description = description.replace(/\*/g, "").trim();
      setSidebarContent(description);
    } catch (error) {
      setSidebarContent("Failed to load description.");
    }
    setDescriptionLoading(false);
    setSidebarOpen(true);
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Function to download the roadmap as a PDF
  const downloadRoadmapAsPDF = () => {
    if (roadmapRef.current) {
      html2canvas(roadmapRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("roadmap.pdf");
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h2>{error}</h2>
        </div>
      ) : (
        <>
          {/* Roadmap Container with Download Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}>
            <button className="download-button" onClick={downloadRoadmapAsPDF}>
              Download Roadmap as PDF
            </button>
          </div>
          <div ref={roadmapRef} style={{ flex: 1 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={{ customNode: CustomNode }}
              onNodeClick={(_, node) => openSidebar(node.data.label)}
              fitView
            >
              <Background color="black" gap={16} />
              <Controls />
             
            </ReactFlow>
          </div>
        </>
      )}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "300px",
            height: "100vh",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <button onClick={closeSidebar}>Close</button>
          {descriptionLoading ? (
            <h2
             style={{
                color: "#000",
              }}
            >Loading description...</h2>
          ) : (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "1.1em",
                color: "#333",
              }}
            >
              {sidebarContent}
            </pre>
          )}
        </div>
      )}
      {/* Button and Spinner CSS */}
      <style jsx>{`
        .download-button {
          padding: 12px 18px;
          font-size: 14px;
          font-weight: bold;
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .download-button:hover {
          background: linear-gradient(45deg, #2575fc, #6a11cb);
          animation: rotateGradient 2s linear infinite;
        }

        @keyframes rotateGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top-color: #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Roadmap;
