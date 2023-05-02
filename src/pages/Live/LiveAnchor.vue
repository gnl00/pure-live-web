<template>
  <div id="content">
    <video id="videoStream" muted autoplay></video>
  </div>
	<div id="endDiv" @click="endBtnClick">结束</div>
</template>

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

	for (const track of stream?.getTracks()) {
    track.stop()
	}

	recorder.stop()

	console.log('videoChunks ', videoChunks)
	handleVideoChunks();
}


let uploadVideoBody = null;
const handleVideoChunks = () => {
	if (videoChunks.length < 0) {
		return
  }

	const fd = new FormData();
	const blob = new Blob(videoChunks, {
    type: 'video/webm; codecs=vp9'
  });
	fd.append('video', blob, 'video.webm')

	console.log(fd)

	uploadVideoBody = fd

	uploadVideoChunks()
}

const uploadVideoChunks = () => {
	fetch("http://localhost:8080/test/videoUpload", {
		method: 'post',
    body: uploadVideoBody
  })
}
</script>

<style scoped>
#videoStream {
	min-height: 70vh;
  border-radius: 10px;
}

#endDiv {
  background-color: red;
  color: white;
  padding: 10px;
  font-size: 18px;
  border-radius: 10px;
  min-width: 5em;
}
</style>