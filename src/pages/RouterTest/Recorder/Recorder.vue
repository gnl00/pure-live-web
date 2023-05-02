<script setup>
import {onMounted, ref} from "vue";


// 音频/视频流配置
const mediaOptions = {
	audio: false,
	video: {
		height: 1920,
		width: 1080
	}
}

const recordOptions = {
	/**
	 * videoBitsPerSecond: 视频比特率，默认 2.5 Mbps => 2500000
	 * 360p => 1 Mbps
	 * 480p => 2.5 Mbps
	 * 720p => 5 Mbps
	 * 1080p => 8 Mbps
	 * 1440p => 16 Mbps
	 * 2160p => 35 ~ 45 Mbps
	 */
	videoBitsPerSecond : 8000000,
	mimeType : 'video/webm'
}

let streamGlobal = null
let videoContentGlobal = null
let replayVideoGlobal = null
let recorderGlobal = null;
let recordChunks = []

let downloadURL = ref('')
let downloadName = ref('')

onMounted(() => {
	openStream().then(stream => {
		const videoContent= videoContentGlobal = document.getElementById('videoContent');
		replayVideoGlobal = document.getElementById('replayVideoContent');

		if (stream instanceof MediaStream) {
			streamGlobal = stream;
			videoContent.srcObject = stream;

			recordStart()
    }
  })
})

const openStream = () => {
	return navigator.mediaDevices.getDisplayMedia(mediaOptions)
			.then(stream => stream)
			.catch(err => {
				console.log('getUserMedia() error ', err.message)
			})
}

const closeStream = () => {
	streamGlobal?.getTracks().forEach(track => {
		track.stop()
	})

	videoContentGlobal.srcObject = null
	recordStop()

	prepareVideoData()
}

const recordStart = () => {
	const recorder = recorderGlobal = new MediaRecorder(streamGlobal, recordOptions);
	recorder.start()
	recorder.ondataavailable = evt => handleRecordData(evt)
}

const handleRecordData = evt => {
  recordChunks.push(evt.data)
}

const recordStop = () => {
	recorderGlobal.stop()

	const blob = new Blob(recordChunks, {type: 'video/webm'})
	recordChunks = []

	downloadURL.value = URL.createObjectURL(blob)
	// downloadName.value = 'test-' + new Date().getTime() + '.webm';

	console.log(downloadURL)

  // handle replay
	replayVideoGlobal.onloadeddata = onReplayLoadedData
	replayVideoGlobal.src = downloadURL.value
}

const onReplayLoadedData = (ObjectURL) => {
	console.log(ObjectURL)
}

const prepareVideoData = () => {
}

</script>

<template>
  <div id="recorder">
	  <video id="videoContent" muted controls autoplay />
	  <div id="endDiv" @click="closeStream">结束</div>
    <br>
    <a :download="downloadName" :href="downloadURL" id="link">download video</a>
	  <br>
	  <br>
    <video id="replayVideoContent" muted controls autoplay />
  </div>
</template>

<style scoped>
#recorder {
  padding: 10px;
}

#endDiv {
	background-color: red;
	color: white;
	padding: 10px;
	font-size: 18px;
	border-radius: 25px;
	min-width: 5em;
}
</style>