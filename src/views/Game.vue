<template>
  <div class="game-container">
    <!-- HEADER -->
    <div class="game-header">
      <div class="room-info">
        <span>Room: <strong>{{ roomCode }}</strong></span>
        <span class="separator">|</span>
        <span>Player: <strong>{{ playerName }}</strong></span>
      </div>
      <button @click="leaveGame" class="leave-btn">Leave Game</button>
    </div>


    <!-- GAME -->
    <div class="game">

      <!-- Song -->
      <div class="song-container">
        <div class="song">
          <img src="" alt="Song Cover" class="song-cover">
          <h2 class="song-title">[ Title ]</h2>
        </div>

        <!-- Options -->
        <div class="options">
          <button class="option" id="option-1">Option 1</button>
          <button class="option" id="option-2">Option 2</button>
          <button class="option" id="option-3">Option 3</button>
          <button class="option" id="option-4">Option 4</button>
        </div>
      </div>

    </div>
    

    <!-- DEBUGGING -->
    <div class="debug-panel">
      <h3>Debug Info</h3>
      <div class="debug-item">
        <strong>Socket ID:</strong> {{ socket?.id }}
      </div>
      <div class="debug-item">
        <strong>Connected:</strong> {{ connected ? 'Yes' : 'No' }}
      </div>
      <div class="debug-item">
        <strong>Room Code:</strong> {{ roomCode }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSocket } from '../composables/useSocket';

const router = useRouter();
const route = useRoute();
const { connected, emit, on, socket } = useSocket();

const roomCode = ref(route.params.roomCode);
const playerName = ref(route.query.name || 'Guest');

onMounted(() => {
  if (!roomCode.value || !playerName.value) {
    router.push('/');
    return;
  }

  // Wait for socket connection
  const checkConnection = setInterval(() => {
    if (connected.value) {
      // Rejoin room in game mode
      emit('join-game', {
        roomCode: roomCode.value,
        playerName: playerName.value
      });
      clearInterval(checkConnection);
    }
  }, 100);

  // Listen for game events
  on('game-update', (data) => {
    console.log('Game update:', data);
    // Handle game state updates here
  });

  on('player-action', (data) => {
    console.log('Player action:', data);
    // Handle player actions here
  });
});

onUnmounted(() => {
  emit('leave-game', { roomCode: roomCode.value });
});

const leaveGame = () => {
  emit('leave-game', { roomCode: roomCode.value });
  router.push('/');
};

// Example: Send a game action
const sendGameAction = (action, data) => {
  emit('game-action', {
    roomCode: roomCode.value,
    action,
    data
  });
};

// Expose functions for your game code
defineExpose({
  sendGameAction,
  emit,
  on
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-dark);
}

/* HEADER */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: var(--bg-darker);
  color: var(--text-white);
  box-shadow: var(--shadow-medium);
}

.room-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

.room-info strong {
  color: var(--accent);
}

.separator {
  color: var(--text-secondary);
}

.leave-btn {
  padding: 8px 16px;
  background: var(--danger);
  color: var(--text-white);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.leave-btn:hover {
  background: var(--danger-dark);
}



/* GAME */
.game {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;

  border: 1px solid #fff; /* temp */
}

/* Song */
.song-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;

  max-width: 1000px;
  width: 100%;

  padding: 2rem;

  border-radius: 10px;

  background-color: var(--bg-darker);
}

/* song - cover, title */
.song {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;

  width: 100%;

  padding: 1rem;

  border-radius: 10px;

  background-color: var(--bg-darkest);
}

.song-cover {
  height: 100px;
  width: 100px;
}

.song-title {
  font-size: 25px;
}

/* options */
.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.option {

}



/* DEBUGGING */
.debug-panel {
  position: absolute;
  bottom: 0;
  left: 0;

  margin: 20px;

  padding: 20px;
  
  border-radius: 8px;
  
  background: var(--bg-darkest);
  
  text-align: left;
}

.debug-panel h3 {
  margin: 0 0 15px 0;

  color: var(--accent);
  font-size: 16px;
}

.debug-item {
  margin: 8px 0;
  
  padding: 10px;
  
  border-radius: 4px;
  
  background: var(--bg-dark);

  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.debug-item strong {
  color: var(--accent);
}
</style>
