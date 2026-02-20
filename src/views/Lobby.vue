<template>
  <div class="lobby-container">
    <div class="lobby-card">
      <div class="lobby-header">
        <h1>Room Lobby</h1>
        <div class="room-code">
          <span>Room Code:</span>
          <strong>{{ roomCode }}</strong>
          <button @click="copyRoomCode" class="copy-btn">
            {{ copied ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <div class="status">
        <span :class="connected ? 'connected' : 'disconnected'">
          {{ connected ? '● Connected' : '● Disconnected' }}
        </span>
      </div>

      <div class="players-section">
        <h2>Players ({{ players.length }})</h2>
        <div class="players-list">
          <div
            v-for="player in players"
            :key="player.id"
            class="player-item"
          >
            <span class="player-name">{{ player.name }}</span>
            <span v-if="player.isHost" class="host-badge">Host</span>
            <span v-if="player.id === socketId" class="you-badge">You</span>
          </div>
        </div>

        <div v-if="players.length === 0" class="empty-state">
          Waiting for players to join...
        </div>
      </div>

      <div class="lobby-actions">
        <button
          v-if="isHost"
          @click="startGame"
          :disabled="players.length < 1 || !connected"
          class="start-btn"
        >
          Start Game
        </button>
        <div v-else class="waiting-message">
          Waiting for host to start the game...
        </div>

        <button @click="leaveLobby" class="leave-btn">
          Leave Lobby
        </button>
      </div>

      <div v-if="error" class="error">
        {{ error }}
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
const isHost = ref(route.query.host === 'true');
const players = ref([]);
const error = ref('');
const copied = ref(false);
const socketId = ref('');

onMounted(() => {
  if (!roomCode.value || !playerName.value) {
    router.push('/');
    return;
  }

  // Wait for socket to connect
  const checkConnection = setInterval(() => {
    if (connected.value && socket.value) {
      socketId.value = socket.value.id;

      // Join the room
      emit('join-room', {
        roomCode: roomCode.value,
        playerName: playerName.value,
        isHost: isHost.value
      });

      clearInterval(checkConnection);
    }
  }, 100);

  // Listen for room updates
  on('room-update', (data) => {
    players.value = data.players;
  });

  // Listen for game start
  on('game-start', () => {
    router.push({
      name: 'game',
      params: { roomCode: roomCode.value },
      query: { name: playerName.value }
    });
  });

  // Listen for errors
  on('room-error', (message) => {
    error.value = message;
  });
});

onUnmounted(() => {
  // Leave room when component unmounts
  emit('leave-room', { roomCode: roomCode.value });
});

const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const startGame = () => {
  if (isHost.value && players.value.length >= 1) {
    emit('start-game', { roomCode: roomCode.value });
  }
};

const leaveLobby = () => {
  emit('leave-room', { roomCode: roomCode.value });
  router.push('/');
};
</script>

<style scoped>
.lobby-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.lobby-card {
  background: var(--bg-white);
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: var(--shadow-large);
}

.lobby-header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.room-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: var(--bg-lighter);
  border-radius: 8px;
  font-size: 18px;
}

.room-code strong {
  color: var(--primary);
  font-size: 24px;
  letter-spacing: 2px;
}

.copy-btn {
  padding: 6px 12px;
  font-size: 14px;
  background: var(--primary);
  width: auto;
}

.status {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.connected {
  color: var(--info);
  font-weight: 600;
}

.disconnected {
  color: var(--info-error);
  font-weight: 600;
}

.players-section {
  margin: 30px 0;
}

h2 {
  color: var(--text-primary);
  margin-bottom: 15px;
  font-size: 20px;
}

.players-list {
  border: 2px solid var(--border-light);
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-bottom: 1px solid var(--border-light);
}

.player-item:last-child {
  border-bottom: none;
}

.player-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
}

.host-badge,
.you-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.host-badge {
  background: var(--badge-host);
  color: var(--text-primary);
}

.you-badge {
  background: var(--badge-you);
  color: var(--text-white);
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
}

.lobby-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

button {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn {
  background: var(--success);
  color: var(--text-white);
}

.start-btn:hover:not(:disabled) {
  background: var(--success-dark);
}

.start-btn:disabled {
  background: var(--disabled);
  cursor: not-allowed;
}

.leave-btn {
  background: var(--error);
  color: var(--text-white);
}

.leave-btn:hover {
  background: var(--error-dark);
}

.waiting-message {
  padding: 14px;
  text-align: center;
  background: var(--warning-bg);
  border: 2px solid var(--warning);
  border-radius: 8px;
  color: var(--warning-text);
  font-weight: 600;
}

.error {
  margin-top: 20px;
  padding: 12px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 8px;
  color: var(--error-text);
  text-align: center;
}
</style>
