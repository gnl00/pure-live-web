<template>
  <h1 id="title">
    Pure Live
  </h1>
  <div id="wrapper">
    <div id="selector">
      <button @click="anchorClick">主播</button>
      <button @click="audienceClick">观众</button>
    </div>
<!--    <div id="content">-->
<!--      <video id="videoStream" muted autoplay controls></video>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// 音频/视频流配置
const mediaOptions = {
	audio: false,
	video: {
		height: 1920,
		width: 1080
	}
}

onMounted(() => {
  // setStream()
})

const openStream = async () => {
	let stream = null;
	// stream = await navigator.mediaDevices.getUserMedia(mediaOptions)
	stream = await navigator.mediaDevices.getDisplayMedia(mediaOptions)
			.then(stream => stream)
      .catch(err => {
	      console.log("open stream with error: ", err.message)
      })

  return stream
}

const setStream = () => {
	const videoStream = document.getElementById("videoStream");

	openStream().then(stream => {
		stream.oninavtive = () => {
			videoStream.srcObject = null
		}
		videoStream.srcObject = stream
	})
}

const anchorClick = () => {
	console.log("I am anchor")
}
const audienceClick = () => {
	console.log("I am audience")
}

</script>

<style scoped>
#title {
  color: #6ba5ed;
}

 #wrapper {
   min-height: 80%;
 }

 #selector {
   padding: 5px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-content: center;
   align-items: center;
   background-color: #d8d7d7;
   min-height: 50vh;
   border-radius: 10px;
 }

 #selector button {
   font-size: 20px;
   margin: 5px;
   padding: 5px;
   background-color: #6ba5ed;
   border: none;
   border-radius: 25px;
   color: white;
   height: 50px;
  min-width: 20vw;
 }

 #selector button:hover {
	 background-color: #195095;
 }

 #content {}

 #videoStream {
   min-height: 70vh;
 }
</style>