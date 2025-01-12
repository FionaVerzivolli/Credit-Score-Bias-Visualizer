let webSocket = null;

export function connectWebSocket(url) {
  if (!webSocket) {
    webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    webSocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    webSocket.onclose = () => {
      console.log("WebSocket connection closed");
      webSocket = null; // Reset the WebSocket instance
    };
  }
}

export function getWebSocket() {
  return webSocket;
}
