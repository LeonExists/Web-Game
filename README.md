# Web Game

A real-time multiplayer web game built with Vue.js and Socket.IO.

## Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- Vue Router
- Socket.IO Client
- Vite

**Backend:**
- Node.js
- Express
- Socket.IO

## Features

- Real-time multiplayer functionality
- Room-based game system (create/join rooms)
- Player lobby with live updates
- Host controls for game management
- Responsive design with CSS variables for easy theming

## Project Structure

```
├── server/              # Express backend with Socket.IO
│   └── index.js        # Main server file
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Vue composables (useSocket)
│   ├── router/         # Vue Router configuration
│   ├── views/          # Page components
│   │   ├── Home.vue    # Landing page with room creation/join
│   │   ├── Lobby.vue   # Waiting room for players
│   │   └── Game.vue    # Main game area
│   ├── App.vue         # Root component
│   ├── main.js         # App entry point
│   └── style.css       # Global styles with CSS variables
└── package.json

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Web-Game
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run both the backend and frontend servers:

1. **Start the backend server:**
```bash
npm run server:dev
```
The backend will run on `http://localhost:3000`

2. **In a new terminal, start the frontend:**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

Build the frontend for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Play

1. **Enter your name** on the home page
2. **Create a room** or **join an existing room** with a room code
3. **Wait in the lobby** for other players to join
4. **Host starts the game** when ready
5. Play and have fun!

## Socket.IO Events

### Client → Server
- `join-room` - Join a game room
- `leave-room` - Leave current room
- `start-game` - Host starts the game
- `join-game` - Join game after start
- `game-action` - Send game actions

### Server → Client
- `room-update` - Player list updates
- `game-start` - Game has started
- `game-update` - Game state changes

## Development

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Run backend (production)
- `npm run server:dev` - Run backend with auto-reload (development)

### CSS Variables

The project uses CSS variables for theming. All colors and common values are defined in [src/style.css](src/style.css):

- Brand colors: `--primary`, `--secondary`, `--accent`
- Background colors: `--bg-white`, `--bg-dark`, etc.
- Status colors: `--success`, `--error`, `--warning`
- And more...

## License

MIT
