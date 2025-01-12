import React, { useEffect, useState } from "react";

const WebSocketWithFileUpload = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:9001");

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };
    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    setWs(socket);

    return () => socket.close();
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader(); // FileReader to read the file
      reader.onload = (event) => {
        const jsonData = event.target.result; // File content as string
        try {
          const parsedData = JSON.parse(jsonData); // Verify it's valid JSON
          console.log("Parsed JSON:", parsedData);
  
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(jsonData); // Send file content to the WebSocket server
            console.log("JSON file sent to backend:", jsonData);
          } else {
            console.error("WebSocket is not open");
          }
        } catch (err) {
          console.error("Invalid JSON file:", err);
        }
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  
  return (
    <div>
      <h1>WebSocket File Upload Example</h1>
      <div>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
        />
      </div>
      <div>
        <h2>Messages from Backend:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketWithFileUpload;
