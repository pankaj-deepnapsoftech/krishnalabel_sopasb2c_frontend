// src/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = 'http://localhost:8077'; // Replace with your server URL
// const URL = 'https://rtpasbackend.deepmart.shop'; // Replace with your server URL

export const socket: Socket = io(URL, {
  autoConnect: false, // optional: control connection manually
});
