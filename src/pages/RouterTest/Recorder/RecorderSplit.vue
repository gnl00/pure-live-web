<script setup>
import { onMounted, ref } from "vue";

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
	mimeType : 'video/webm;codecs=h264'
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
			.then(stream => {				
				return stream
			})
			.catch(err => {
				console.log('getUserMedia() error ', err.message)
			})
}

const closeStream = () => {
	if (recorderGlobal.state === 'inactive') return

	streamGlobal?.getTracks().forEach(track => {
		track.stop()
	})

	videoContentGlobal.srcObject = null
	recordStop()

	console.log(recorderGlobal);
}

const recordStart = () => {
	// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/dataavailable_event
	const recorder = recorderGlobal = new MediaRecorder(streamGlobal, recordOptions);
	console.log(recorder);
	// 将 timeslice 属性传递到开始媒体捕获的 MediaRecorder.start() 方法中，则每 timeslice 毫秒触发一次事件
	recorder.start(1000)
	recorder.ondataavailable = evt => handleRecordData(evt)
	recorder.onstop = evt => onRecorderStop(evt)
}

let objectURL = null

const handleRecordData = evt => {
	console.log('handleRecordData()')
	const chunk = evt.data
  recordChunks.push(chunk)

	uploadBlob(chunk);
}

const onRecorderStop = (evt) => {
	console.log('onRecorderStop()')
	console.log(recordChunks)

	const blob = new Blob(recordChunks, {type: 'video/webm'})
	recordChunks = []
	prepareVideoData(blob)
}

const recordStop = () => {
	recorderGlobal.stop()
}

const prepareVideoData = (blob) => {
	objectURL = URL.createObjectURL(blob)

	downloadURL.value = objectURL
	downloadName.value = 'test_' + new Date().getTime() + '.webm';

	// handle replay
	replayVideoGlobal.onloadeddata = onReplayLoadedData
	replayVideoGlobal.src = objectURL
}

const onReplayLoadedData = () => {
  // URL.revokeObjectURL(objectURL)
}

const uploadBlob = (chunk) => {
	const chunks = []
	chunks.push(chunk)
	const blob = new Blob(chunks, {type: 'video/webm'});
	// const fd = new FormData();
	// fd.append('blob', blob, '');
  // console.log(fd);


	blobToArrayBuffer(blob);
}

const blobToArrayBuffer = (blob) => {

	const reader = new FileReader();
	reader.onload = () => {
		const base64String = btoa(reader.result)
		const arrayBuffer = reader.result
		// console.log(arrayBuffer);
		console.log(base64String);

		doUploadBlob(base64String);
	}
	reader.readAsBinaryString(blob)
}

const doUploadBlob = (body) => {
	const url = 'http://localhost:8080/test/blobUpload'
	fetch(url, {
		method: 'POST',
		body
	}).then(res => {
		console.log('doUploadBlob success ',  res);
	}).catch(err => {
		console.log('doUploadBlob error ', err.message);
	})
}

</script>

<template>
  <div id="recorder">
    <div id="videoArea">
	    <div>
				<h2>Recording</h2>
				<video id="videoContent" muted controls autoplay />
			</div>
			<div>
				<h2>Replay</h2>
				<video id="replayVideoContent" muted controls autoplay />
			</div>
    </div>

		<br>
	  <div id="endDiv">
			<button @click="closeStream">结束</button>
		</div>

	  <br>
	  <div id="downloadDiv">
			<a :download="downloadName" :href="downloadURL" id="link">Download video</a>
		</div>
  </div>
</template>

<style scoped>
#recorder {
  padding: 10px;
	width: 100%;
}

#videoArea {
	width: 100%;
	display: flex;
	justify-content: space-evenly;
}

#videoContent {
	max-width: 50%;
}

#replayVideoContent {
	max-width: 50%;
}

#endDiv {
	padding: 10px;
  width: 100%;
}

#endDiv button {
	border: none;
	background-color: red;
	color: white;
	padding: 10px;
	font-size: 18px;
	border-radius: 25px;
	width: 10%;
}

#downloadDiv {
	padding: 10px;
	width: 100%;
}

#downloadDiv a {
	background-color: white;
	padding: 15px;
	border-radius: 25px;
	text-decoration: none;
}
</style>