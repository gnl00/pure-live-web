import { createRouter, createWebHistory } from 'vue-router'

const LiveMain = () => import("../pages/Live/LiveMain.vue")
const LiveAnchor = () => import("../pages/Live/LiveAnchor.vue")
const LiveAudience = () => import("../pages/Live/LiveAudience.vue")
const About = () => import("../pages/RouterTest/About/About.vue")
const Profile = () => import("../pages/RouterTest/Profile/Profile.vue")
const Upload = () => import("../pages/RouterTest/Upload/Upload.vue")
import Recorder from "../pages/RouterTest/Recorder/Recorder.vue";
import RecorderSplit from "../pages/RouterTest/Recorder/RecorderSplit.vue";
import Response from "../pages/RouterTest/Response/Response.vue";
import Websocket from "../pages/RouterTest/Websocket/Websocket.vue";

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
	{
		path: '/split',
		component: RecorderSplit
	},
	{
		path: '/resp',
		component: Response
	},
	{
		path: '/ws',
		component: Websocket
	},
]

const router = createRouter({
	history: createWebHistory(), // 内部提供了 history 模式的实现
	routes
})

export default router