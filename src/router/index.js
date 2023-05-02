import Recorder from "../pages/RouterTest/Recorder/Recorder.vue";

const LiveMain = () => import("../pages/Live/LiveMain.vue")
const LiveAnchor = () => import("../pages/Live/LiveAnchor.vue")
const LiveAudience = () => import("../pages/Live/LiveAudience.vue")
const About = () => import("../pages/RouterTest/About/About.vue")
const Profile = () => import("../pages/RouterTest/Profile/Profile.vue")
const Upload = () => import("../pages/RouterTest/Upload/Upload.vue")
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		component: LiveMain
	},
	{
		path: '/anchor',
		component: LiveAnchor
	},
	{
		path: '/audience',
		component: LiveAudience
	},
	{
		path: '/upload',
		component: Upload
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/profile',
		component: Profile
	},
	{
		path: '/record',
		component: Recorder
	},
]

const router = createRouter({
	history: createWebHistory(), // 内部提供了 history 模式的实现
	routes
})

export default router