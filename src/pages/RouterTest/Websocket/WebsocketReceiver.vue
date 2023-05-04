<script setup>
import { onMounted, ref } from 'vue';
import videojs from "video.js";

let downloadLink = ref(null)
let videoSource = ref('http://localhost:8888/video/index.m3u8')

let chunks = []
let latestObjectURL = null;
let videoContentGlobal = null;
let lastTimeUsedVideo = null;

const ws = new WebSocket('ws://localhost:8080/ws/test/1');

ws.onmessage = message => {
  console.log(message);
	let data = null
	if (message && (data = message.data)) {
		console.log('data before ', data)
		// data = data.slice(data.indexOf('tsdata'))
		// console.log('data after ', data)

  }

  if (message && message.data instanceof Blob) {

    const resp = message.data
    chunks.push(resp)

    const blob = new Blob([resp], {type: 'video/webm'});

    // base64 读取 blob
    // const reader = new FileReader();
    // reader.onload = () => {
    //   const base64Data = reader.result

    //   const renders = document.getElementsByClassName('videoRender')
    //   for (const videoRender of renders) {
    //     if (lastTimeUsedVideo != videoRender) {
    //       videoRender.src = base64Data
    //       console.log(videoRender);
    //       lastTimeUsedVideo = videoRender
    //       break;
    //     }
    //   }

    // }
    // reader.readAsDataURL(blob);

    // URL.createObjectURL() 读取 blob
    if (latestObjectURL) {
      URL.revokeObjectURL(latestObjectURL)
    }
    console.log('latestObjectURL after revoke ', latestObjectURL);

    const objectURL = URL.createObjectURL(blob);
    latestObjectURL = objectURL

    // save video to local
    const download = document.createElement('a');
	  download.href = latestObjectURL
	  download.click()

    // load video data from url
    // videoContentGlobal.src = latestObjectURL

    // load video data from local
  }


}

ws.onerror = err => {
	console.log('ws onerror() ', err);
}

ws.onclose = evt => {
	console.log('ws onclose() ', evt);
}

onMounted(() => {
  videoContentGlobal = document.getElementById('videoContent');

	const player = videojs('videoJS')
	console.log(player)
	player.play()
})

const generateVideo = () => {
  console.log(chunks);

  const blob = new Blob(chunks, {type: 'video/webm'});
}

</script>

<template>
  <div id="receiver">
    <button @click="generateVideo">generateVideo</button>
    <video id="videoContent" autoplay muted controls />
    <a :href="downloadLink">download</a>
  </div>
  <div>
    <img id="imgN" src="http://localhost:8888/image/test.png"  alt="test.png"/>
    <video id="videoJS" class="video-js" autoplay muted controls preload="auto" >
      <source :src="videoSource" />
    </video>
    <a href="http://localhost:8888/video/test.mp4">download from nginx</a>
  </div>
</template>

<style scoped>
#receiver {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#videoContent {
  max-width: 50%;
}

#imgN {
  max-width: 200px;
  max-height: 200px;
}
</style>