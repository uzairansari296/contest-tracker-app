//Modify Frontend to Listen for Real-Time Updates
//Setup Socket Connection (frontend/src/services/socket.js)

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on('connect_error', (error) => {
    console.warn('Socket connection error:', error);
});

export default socket;
