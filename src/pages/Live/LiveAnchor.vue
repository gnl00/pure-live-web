<script setup>
import {onMounted, watch, ref} from "vue";

// 音频/视频流配置
const mediaOptions = {
	audio: false,
	video: {
		height: 1920,
		width: 1080
	}
}

let videoSource = ref(null);
let recorder = null
const videoChunks = []

onMounted(() => {
	getAndSetStream().then(stream => {
		if (stream) {
			recorder = new MediaRecorder(stream);
			recorder.start();

			recorder.ondataavailable = evt => {
				videoChunks.push(evt.data)
			}
		}
  })
})

watch(videoSource, () => {
	console.log('watch videoSource value ', videoSource.value)
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

const getAndSetStream = async () => {
	const videoStream = document.getElementById("videoStream");

	return await openStream().then(stream => {
	  stream.oninavtive = () => {
		  videoStream.srcObject = null
		  videoSource.value = null
	  }
	  videoStream.srcObject = stream
    videoSource.value = stream

	  return stream
  })
}

const endBtnClick = () => {
	const videoStream = document.getElementById("videoStream");
	const stream = videoStream.srcObject;

	videoStream.srcObject = null
	videoSource.value = null

	stream?.getTracks().forEach(track => {
		track.stop()
	})

	recorder.stop()

	console.log('videoChunks ', videoChunks)
	handleVideoChunks();
}


const handleVideoChunks = () => {

	uploadVideoChunks()
}

const uploadVideoChunks = () => {
}
</script>

<template>
	<div id="anchor">
		<div id="videoContent">
			<video id="videoStream" muted autoplay />
		</div>
		<div id="endDiv" @click="endBtnClick">结束</div>
  </div>
</template>

<style scoped>
#anchor {
  margin: 10px;
  padding: 10px;
}

#videoStream {
  border-radius: 10px;
}

#endDiv {
  background-color: red;
  color: white;
  padding: 10px;
  font-size: 18px;
  border-radius: 10px;
}
</style>