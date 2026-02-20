<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Welcome to Web Game</h1>

      <div class="form-group">
        <label>Your Name</label>
        <input
          v-model="playerName"
          placeholder="Enter your name..."
          @keyup.enter="focusRoomCode"
          maxlength="20"
        />
      </div>

      <div class="actions">
        <div class="action-card">
          <h3>Join Room</h3>
          <input
            ref="roomCodeInput"
            v-model="roomCode"
            placeholder="Enter room code..."
            @keyup.enter="joinRoom"
            maxlength="6"
          />
          <button
            @click="joinRoom"
            :disabled="!canJoinRoom"
          >
            Join Room
          </button>
        </div>

        <div class="divider">OR</div>

        <div class="action-card">
          <h3>Create Room</h3>
          <button
            @click="createRoom"
            :disabled="!playerName.trim()"
            class="create-btn"
          >
            Create New Room
          </button>
        </div>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const playerName = ref('');
const roomCode = ref('');
const error = ref('');
const roomCodeInput = ref(null);

const canJoinRoom = computed(() => {
  return playerName.value.trim() && roomCode.value.trim();
});

const focusRoomCode = () => {
  if (playerName.value.trim()) {
    roomCodeInput.value?.focus();
  }
};

const createRoom = () => {
  if (!playerName.value.trim()) {
    error.value = 'Please enter your name';
    return;
  }

  error.value = '';

  // Generate a random 6-character room code
  const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  router.push({
    name: 'lobby',
    params: { roomCode: newRoomCode },
    query: { name: playerName.value.trim(), host: 'true' }
  });
};

const joinRoom = () => {
  if (!canJoinRoom.value) {
    error.value = 'Please enter your name and room code';
    return;
  }

  error.value = '';

  router.push({
    name: 'lobby',
    params: { roomCode: roomCode.value.toUpperCase() },
    query: { name: playerName.value.trim() }
  });
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;

  padding: 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.home-card {
  background: var(--bg-white);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-large);
}

h1 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--border-primary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-card {
  padding: 20px;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  background: var(--bg-light);
}

.action-card h3 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 18px;
}

.action-card input {
  margin-bottom: 12px;
}

button {
  width: 100%;
  padding: 12px 24px;
  background: var(--primary);
  color: var(--text-white);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: var(--primary-dark);
}

button:disabled {
  background: var(--disabled);
  cursor: not-allowed;
}

.create-btn {
  background: var(--secondary);
}

.create-btn:hover:not(:disabled) {
  background: var(--secondary-dark);
}

.divider {
  text-align: center;
  color: var(--text-muted);
  font-weight: 600;
  position: relative;
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
