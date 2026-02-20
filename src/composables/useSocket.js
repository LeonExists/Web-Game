import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export function useSocket() {
  const socket = ref(null);
  const connected = ref(false);

  onMounted(() => {
    // Connect to the backend
    socket.value = io('http://localhost:3000');

    socket.value.on('connect', () => {
      connected.value = true;
      console.log('Connected to server:', socket.value.id);
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
      console.log('Disconnected from server');
    });
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  // Send a message
  const emit = (event, data) => {
    if (socket.value) {
      socket.value.emit(event, data);
    }
  };

  // Listen for a message
  const on = (event, callback) => {
    if (socket.value) {
      socket.value.on(event, callback);
    }
  };

  // Remove listener
  const off = (event, callback) => {
    if (socket.value) {
      socket.value.off(event, callback);
    }
  };

  return {
    socket,
    connected,
    emit,
    on,
    off
  };
}
