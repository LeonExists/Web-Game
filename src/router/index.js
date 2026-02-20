import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Lobby from '../views/Lobby.vue';
import Game from '../views/Game.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/lobby/:roomCode',
    name: 'lobby',
    component: Lobby
  },
  {
    path: '/game/:roomCode',
    name: 'game',
    component: Game
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
