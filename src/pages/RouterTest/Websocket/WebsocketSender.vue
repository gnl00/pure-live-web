<script setup>
import { onMounted, ref } from 'vue';

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

let iptVal = ref('hahaha')
let downloadLink = ref(null)

let streamGlobal = null
let recorderGlobal = null

let ws = new WebSocket('ws://localhost:8080/ws/test/0');
ws.onmessage = message => {
  console.log(message);
  if (message && message.data instanceof Blob) {
    const resp = message.data
    const blob = new Blob([resp], {type: 'video/webm'});

    const objectURL = URL.createObjectURL(blob);
    downloadLink.value = objectURL
  }
}

ws.onerror = err => {
	console.log('ws onerror() ', err);
}

ws.onclose = evt => {
	console.log('ws onclose() ', evt);
}

onMounted(() => {
  openStream().then(stream => {
    const videoContent = document.getElementById('videoContent');
    videoContent.srcObject = stream
    streamGlobal = stream

    recordStart();
  })
})

const openStream = async () => {
	return await navigator.mediaDevices.getDisplayMedia(mediaOptions)
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

	recordStop()
  clearVideoStream()
}

const clearVideoStream = () => {
  const videoContent = document.getElementById('videoContent');
  videoContent.srcObject = null
}

const recordStart = () => {
	const recorder = recorderGlobal = new MediaRecorder(streamGlobal, recordOptions);
	recorder.start(5000)
	recorder.ondataavailable = evt => onRecoderDataAvailable(evt)
	recorder.onstop = evt => onRecorderStop(evt)
}

let recordChunks = []

const onRecoderDataAvailable = evt => {
	console.log('onRecoderDataAvailable()')
  const chunk = evt.data;
  console.log(chunk);
  recordChunks.push(chunk)

  // send websocket data here
  wsSend(chunk);
}

const onRecorderStop = () => {
	console.log('onRecorderStop()')
	// console.log(recordChunks)

  const reader = new FileReader();
	reader.onload = () => {
		const base64Data = reader.result;
		// console.log(base64Data)

    const replay = document.getElementById('replay');
		replay.src = base64Data
  }
	const blob = new Blob(recordChunks, {type: 'video/webm'})
	reader.readAsDataURL(blob)

	recordChunks = []
}

const wsSend = async (blobChunk) => {
  if (!ws) {
    ws = new WebSocket('ws://localhost:8080/ws/test/0');
  }
  // console.log(ws);

  // 将 blob 转换为更低级别的 arrayBuffer 来处理
  // blobChunk.arrayBuffer().then(buffer => {
  //   console.log(buffer); 

  // })
  
  // 将 blob 转换为 stream 来处理
  // const readableStream = blobChunk.stream();
  // const reader = readableStream.getReader();
  // // console.log(reader);
  // while (true) {
  //   let { done, value } = await reader.read();
  //   if (done) {
  //     console.log('all blob read complete');
  //     break;
  //   }

  //   console.log(value);
  // }


  ws.send(blobChunk);
}

const recordStop = () => {
	recorderGlobal.stop()
}

const clickToSend = () => {
  console.log(iptVal.value);
  ws.send(iptVal.value);
}

const clickToSendBlob = () => {
  const blob = new Blob();
  console.log(blob);
  ws.send(blob);
}

</script>

<template>
  <div id="sender">
    <input type="text" v-model="iptVal" placeholder="input something to send" />
    <button @click="clickToSend">clickToSend</button>
    <button @click="clickToSendBlob">clickToSendBlob</button>
    <a :href="downloadLink">download</a>
  </div>
  <div>
    <video id="videoContent" muted controls autoplay />
	  <video id="replay" muted controls autoplay />

    <div id="endDiv">
			<button @click="closeStream">结束</button>
		</div>
  </div>
</template>

<style scoped>
#sender {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 10px;;
}

#videoContent {
  max-width: 100%;
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
  min-width: 20%;
	width: auto;
}
</style>