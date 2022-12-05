import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from "vue-router"
import BoardView from '../views/BoardView.vue';
import TaskView from '../views/TaskView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: BoardView,
    // this route opens a modal with task details
    children: [
      {
        path: 'task/:id',
        component: TaskView,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
