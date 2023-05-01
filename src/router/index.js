import About from "../pages/RouterTest/About/About.vue";
import Profile from "../pages/RouterTest/Profile/Profile.vue";
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/about',
		component: About
	},
	{
		path: '/profile',
		component: Profile
	},
]

const router = createRouter({
	history: createWebHistory(), // 内部提供了 history 模式的实现
	routes
})

export default router