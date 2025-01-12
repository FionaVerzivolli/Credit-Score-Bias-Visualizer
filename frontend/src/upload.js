import React, { useState, useEffect } from "react";
import { getWebSocket } from "./utils/websocket";

function Upload() {
  const [file, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

  useEffect(() => {
    const ws = getWebSocket();
    if (ws) {
      ws.onopen = () => {
        setIsWebSocketReady(true);
        console.log("WebSocket connection is open.");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        alert("WebSocket connection failed. Please try again.");
      };

      ws.onclose = () => {
        setIsWebSocketReady(false);
        console.warn("WebSocket connection closed.");
      };

      setWebSocket(ws);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid JSON file.");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("No file selected. Please upload a file.");
      return;
    }
  
    if (!isWebSocketReady || !webSocket) {
      alert("WebSocket connection is not ready. Please try again.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const fileContent = e.target.result;
  
      // Log the filename and content to the console
      console.log("File Name:", file.name);
      console.log("File Content:", fileContent);
  
      try {
        console.log("Sending file content to the server...");
        webSocket.send(
          JSON.stringify({
            fileName: file.name,
            content: fileContent,
          })
        );
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error sending file over WebSocket:", error);
        alert("Failed to upload the file.");
      }
    };
  
    reader.onerror = () => {
      console.error("Error reading file.");
      alert("Failed to read the file. Please try again.");
    };
  
    reader.readAsText(file);
  };
  

  return (
    <div className="App">
      <h2>Upload Dataset</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!isWebSocketReady}>
        Upload
      </button>
      {!isWebSocketReady && <p>Waiting for WebSocket connection...</p>}
    </div>
  );
}

export default Upload;
