import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD2YVJ5Q138zY8ISSZ5NSau3y-74u4DX7s"); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function for exponential backoff retry
const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.message.includes("503") && i < retries - 1) {
        console.warn(`Attempt ${i + 1} failed. Retrying in ${delay} ms...`, error);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw new Error(`All ${retries} attempts failed: ${error.message}`);
      }
    }
  }
};

export const generateRoadmap = async (stack) => {
  const prompt = `
    Generate a brief and essential learning roadmap for ${stack} development.
    Organize the roadmap into key categories and subcategories that are essential to becoming proficient in ${stack}. 
    Only include topics that are directly relevant to ${stack} development. Be concise and avoid unnecessary topics.
  `;

  return await retryWithBackoff(async () => {
    const result = await model.generateContent(prompt);
    console.log("Raw AI Response:", result);

    if (result.response && typeof result.response.text === 'function') {
      const textContent = await result.response.text();
      console.log("Parsed Response:", textContent);

      const sections = textContent.split("\n\n").filter(Boolean);

      const nodes = [];
      const edges = [];
      let idCounter = 0;

      // Positioning variables for tree structure
      const mainTopicYSpacing = 250;    // Increased vertical spacing for main topics
      const subtopicXOffset = 400;      // Horizontal distance for subtopics from the main topic
      const subtopicYSpacing = 150;     // Vertical spacing between subtopics to prevent overlap

      let yPosition = 0;  // Initial y position for main topics

      sections.forEach((section, index) => {
        const lines = section.split("\n").filter(Boolean);

        if (lines.length > 0) {
          const mainTopic = lines[0].trim();
          const mainTopicNodeId = `node-${idCounter++}`;

          // Center main topic node horizontally
          nodes.push({
            id: mainTopicNodeId,
            data: { label: mainTopic },
            position: { x: 0, y: yPosition },
            style: {
              background: '#FFD966',
              border: '2px solid #333',
              borderRadius: 8,
              padding: 10,
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              width: 180,
            },
          });

          // Position subtopics branching left and right
          let subtopicYPosition = yPosition + subtopicYSpacing; // Start spacing below the main topic
          let isLeftBranch = true;

          lines.slice(1).forEach((subtopic) => {
            const subtopicNodeId = `node-${idCounter++}`;

            nodes.push({
              id: subtopicNodeId,
              data: { label: subtopic.trim() },
              position: { x: isLeftBranch ? -subtopicXOffset : subtopicXOffset, y: subtopicYPosition },
              style: {
                background: '#FFE599',
                border: '1px solid #999',
                borderRadius: 6,
                padding: 8,
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                width: 160,
              },
            });

            edges.push({
              id: `edge-${mainTopicNodeId}-${subtopicNodeId}`,
              source: mainTopicNodeId,
              target: subtopicNodeId,
              type: 'smoothstep',  // Smooth curved line for flowchart effect
              animated: false,
              style: { stroke: '#333', strokeWidth: 2 },
            });

            // Alternate subtopics between left and right branches
            isLeftBranch = !isLeftBranch;
            subtopicYPosition += subtopicYSpacing; // Increase y-position for the next subtopic to avoid overlap
          });

          // Connect main topics sequentially with flow lines
          if (index > 0) {
            const previousMainTopicNodeId = `node-${idCounter - lines.length - 1}`;
            edges.push({
              id: `edge-${previousMainTopicNodeId}-${mainTopicNodeId}`,
              source: previousMainTopicNodeId,
              target: mainTopicNodeId,
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#333', strokeWidth: 2 },
            });
          }

          // Move y position down for the next main topic
          yPosition += mainTopicYSpacing;
        }
      });

      return { nodes, edges };
    } else {
      console.error("Unexpected response structure:", result);
      return { nodes: [], edges: [] };
    }
  });
};

export const generateDescription = async (topic) => {
  const prompt = `Provide a detailed, concise, and relevant description of the topic "${topic}". Focus on key concepts, its importance, and how it fits into the broader tech stack.`;

  return await retryWithBackoff(async () => {
    const result = await model.generateContent(prompt);

    if (result.response && typeof result.response.text === 'function') {
      const textContent = await result.response.text();
      return textContent.trim();
    } else {
      console.error("Unexpected response structure for description:", result);
      return 'No description available.';
    }
  });
};
