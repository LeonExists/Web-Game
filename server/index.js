import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());


// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});


// Express routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Room management
const rooms = new Map(); // roomCode -> { players: [], host: socketId }

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join room (lobby)
  socket.on('join-room', ({ roomCode, playerName, isHost }) => {
    console.log(`${playerName} joining room ${roomCode}`);

    // Create room if it doesn't exist
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, { players: [], host: socket.id });
    }

    const room = rooms.get(roomCode);

    // Check if player already in room
    const existingPlayer = room.players.find(p => p.id === socket.id);
    if (!existingPlayer) {
      room.players.push({
        id: socket.id,
        name: playerName,
        isHost: isHost || socket.id === room.host
      });
    }

    // Join socket.io room
    socket.join(roomCode);

    // Send updated player list to all in room
    io.to(roomCode).emit('room-update', {
      players: room.players
    });

    console.log(`Room ${roomCode} now has ${room.players.length} players`);
  });

  // Leave room
  socket.on('leave-room', ({ roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      room.players = room.players.filter(p => p.id !== socket.id);

      socket.leave(roomCode);

      // If room is empty, delete it
      if (room.players.length === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted (empty)`);
      } else {
        // Update remaining players
        io.to(roomCode).emit('room-update', {
          players: room.players
        });
      }
    }
  });

  // Game -
  // Start game
  socket.on('start-game', ({ roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);

      // Verify sender is host
      if (socket.id === room.host) {
        console.log(`Starting game in room ${roomCode}`);
        io.to(roomCode).emit('game-start');
      }
    }
  });

  // Join game (after starting)
  socket.on('join-game', ({ roomCode, playerName }) => {
    socket.join(roomCode);
    console.log(`${playerName} joined game ${roomCode}`);
  });

  // Leave game
  socket.on('leave-game', ({ roomCode }) => {
    socket.leave(roomCode);
  });

  // Game action (forward to room)
  socket.on('game-action', ({ roomCode, action, data }) => {
    // Broadcast to all players in the room
    socket.to(roomCode).emit('game-update', {
      playerId: socket.id,
      action,
      data
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove player from all rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        // If room is empty, delete it
        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty after disconnect)`);
        } else {
          // Update remaining players
          io.to(roomCode).emit('room-update', {
            players: room.players
          });
        }
      }
    });
  });
});


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});
